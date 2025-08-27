import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axios";

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

  const {
    register,
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
    },
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axiosInstance.get(`/assignments/${id}/`);
        const data = res.data;

        reset({
          title: data.title,
          description: data.description,
          subject: data.subject,
          grade: data.grade,
          deadline: data.deadline?.slice(0, 16), // yyyy-MM-ddTHH:mm
          max_marks: data.max_marks,
        });

        setLoading(false);
      } catch {
        setServerError("Failed to load assignment data.");
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id, reset]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    setServerError("");

    try {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        setServerError("Deadline must be in the future.");
        setSubmitting(false);
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
          setSubmitting(false);
          return;
        }
        data.append("reference_files", file);
      }

      await axiosInstance.put(`/assignments/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/assignments");
    } catch (err) {
      if (err.response?.data) {
        setServerError(JSON.stringify(err.response.data));
      } else {
        setServerError("Update failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Assignment
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Title"
            {...register("title", { required: true })}
            error={!!errors.title}
            helperText={errors.title && "Required"}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            {...register("description", { required: true })}
            error={!!errors.description}
            helperText={errors.description && "Required"}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="Subject"
            {...register("subject", { required: true })}
            error={!!errors.subject}
            helperText={errors.subject && "Required"}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Grade"
            {...register("grade", { required: true })}
            error={!!errors.grade}
            helperText={errors.grade && "Required"}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Deadline"
            type="datetime-local"
            {...register("deadline", { required: true })}
            InputLabelProps={{ shrink: true }}
            error={!!errors.deadline}
            helperText={errors.deadline && "Required"}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Max Marks"
            type="number"
            {...register("max_marks", {
              required: true,
              min: { value: 1, message: "Must be at least 1" },
            })}
            error={!!errors.max_marks}
            helperText={errors.max_marks?.message || (errors.max_marks && "Required")}
            margin="normal"
          />

          <Box mt={2}>
            <input
              type="file"
              {...register("reference_files")}
              accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx"
            />
          </Box>

          {serverError && (
            <Typography color="error" mt={2}>
              {serverError}
            </Typography>
          )}

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 3 }}
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Assignment"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AssignmentEdit;
