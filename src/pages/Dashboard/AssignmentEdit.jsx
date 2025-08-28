import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
];

const AssignmentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState(""); 
  const [newFileName, setNewFileName] = useState(""); 

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      grade: "",
      deadline: "",
      max_marks: "",
      reference_files: null,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/assignments/${id}/`);
        const data = res.data;

        
        const fileName = data.reference_files
          ? data.reference_files.split("/").pop() || "Existing File"
          : "";

        setCurrentFileName(fileName);

        const formattedDeadline = data.deadline
          ? new Date(data.deadline).toISOString().slice(0, 16)
          : "";

        reset({
          title: data.title || "",
          description: data.description || "",
          subject: data.subject || "",
          grade: data.grade || "",
          deadline: formattedDeadline,
          max_marks: data.max_marks || "",
        });
      } catch (err) {
        setServerError(
          err.response?.data?.detail || "Failed to fetch assignment details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset]);

  const onSubmit = async (formData) => {
    setServerError("");
    setLoading(true);

    try {
      const deadlineDate = new Date(formData.deadline);
      if (isNaN(deadlineDate.getTime())) {
        setServerError("Invalid deadline format.");
        setLoading(false);
        return;
      }
      if (deadlineDate <= new Date()) {
        setServerError("Deadline must be in the future.");
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("subject", formData.subject);
      data.append("grade", formData.grade);
      data.append("deadline", formData.deadline);
      data.append("max_marks", formData.max_marks);

      if (formData.reference_files?.[0]) {
        const file = formData.reference_files[0];
        if (!allowedTypes.includes(file.type)) {
          setServerError("Invalid file type. Allowed: PDF, JPG, PNG, PPT, PPTX.");
          setLoading(false);
          return;
        }
        data.append("reference_files", file);
      }

      await axiosInstance.put(`/assignments/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/teacher-assignments");
    } catch (err) {
      setServerError(
        err.response?.data?.detail || "Failed to update assignment"
      );
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Edit Assignment
      </Typography>

      {serverError && <Alert severity="error">{serverError}</Alert>}
      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Title"
              margin="normal"
              {...field}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              {...field}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        <Controller
          name="subject"
          control={control}
          rules={{ required: "Subject is required" }}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Subject"
              margin="normal"
              {...field}
              error={!!errors.subject}
              helperText={errors.subject?.message}
            />
          )}
        />

        <Controller
          name="grade"
          control={control}
          rules={{ required: "Grade is required" }}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Grade"
              margin="normal"
              {...field}
              error={!!errors.grade}
              helperText={errors.grade?.message}
            />
          )}
        />

        <Controller
          name="deadline"
          control={control}
          rules={{ required: "Deadline is required" }}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Deadline"
              type="datetime-local"
              margin="normal"
              {...field}
              error={!!errors.deadline}
              helperText={errors.deadline?.message}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <Controller
          name="max_marks"
          control={control}
          rules={{
            required: "Max marks are required",
            min: { value: 1, message: "Must be at least 1" },
          }}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Max Marks"
              type="number"
              margin="normal"
              {...field}
              error={!!errors.max_marks}
              helperText={errors.max_marks?.message}
            />
          )}
        />

        <Controller
          name="reference_files"
          control={control}
          render={({ field: { onChange } }) => (
            <Box mt={2}>
              <Button variant="outlined" component="label">
                Upload Reference File
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    onChange(e.target.files);
                    setNewFileName(e.target.files[0]?.name || "");
                  }}
                  accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx"
                />
              </Button>
              {currentFileName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Current File: {currentFileName}
                </Typography>
              )}
              {newFileName && (
                <Typography variant="body2" sx={{ mt: 1, color: "primary.main" }}>
                  New File: {newFileName}
                </Typography>
              )}
            </Box>
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Assignment"}
        </Button>
      </Box>
    </Container>
  );
};

export default AssignmentEdit;