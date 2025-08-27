import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
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

  
  useEffect(() => {
    const fetchData = async () => {
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
      } catch {
        setServerError("Failed to fetch assignment details");
      }
    };
    fetchData();
  }, [id, reset]);

  const onSubmit = async (formData) => {
    setServerError("");
    try {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        setServerError("Deadline must be in the future.");
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
          return;
        }
        data.append("reference_files", file);
      }

      await axiosInstance.put(`/assignments/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/teacher-assignments");
    } catch (err) {
      setServerError("Failed to update assignment");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Edit Assignment
      </Typography>

      {serverError && <Alert severity="error">{serverError}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Title"
          margin="normal"
          {...register("title", { required: "Title is required" })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={3}
          {...register("description", { required: "Description is required" })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <TextField
          fullWidth
          label="Subject"
          margin="normal"
          {...register("subject", { required: "Subject is required" })}
          error={!!errors.subject}
          helperText={errors.subject?.message}
        />

        <TextField
          fullWidth
          label="Grade"
          margin="normal"
          {...register("grade", { required: "Grade is required" })}
          error={!!errors.grade}
          helperText={errors.grade?.message}
        />

        <TextField
          fullWidth
          label="Deadline"
          type="datetime-local"
          margin="normal"
          {...register("deadline", { required: "Deadline is required" })}
          error={!!errors.deadline}
          helperText={errors.deadline?.message}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Max Marks"
          type="number"
          margin="normal"
          {...register("max_marks", {
            required: "Max marks are required",
            min: { value: 1, message: "Must be at least 1" },
          })}
          error={!!errors.max_marks}
          helperText={errors.max_marks?.message}
        />

        <Box mt={2}>
          <input
            type="file"
            {...register("reference_files")}
            accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx"
          />
        </Box>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Update Assignment
        </Button>
      </Box>
    </Container>
  );
};

export default AssignmentEdit;
