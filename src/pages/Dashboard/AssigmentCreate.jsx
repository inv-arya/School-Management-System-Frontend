import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { axiosInstance } from "../../api/axios";

const AssignmentCreate = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("subject", data.subject);
      formData.append("grade", data.grade);
      formData.append("deadline", new Date(data.deadline).toISOString());
      formData.append("max_marks", data.max_marks);

      if (data.reference_files && data.reference_files[0]) {
        formData.append("reference_files", data.reference_files[0]);
      }

      const response = await axiosInstance.post("/api/assignments/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Assignment created:", response.data);
      reset();
    } catch (error) {
      console.error("Error creating assignment:", error.response?.data || error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "white",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create Assignment
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        
        <TextField
          fullWidth
          label="Title"
          {...register("title", { required: "Title is required" })}
          error={!!errors.title}
          helperText={errors.title?.message}
          margin="normal"
        />

        
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          {...register("description", { required: "Description is required" })}
          error={!!errors.description}
          helperText={errors.description?.message}
          margin="normal"
        />

        
        <TextField
          fullWidth
          label="Subject"
          {...register("subject", { required: "Subject is required" })}
          error={!!errors.subject}
          helperText={errors.subject?.message}
          margin="normal"
        />

        
        <TextField
          select
          fullWidth
          label="Grade"
          {...register("grade", { required: "Grade is required" })}
          error={!!errors.grade}
          helperText={errors.grade?.message}
          margin="normal"
        >
          <MenuItem value="9">9</MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="11">11</MenuItem>
          <MenuItem value="12">12</MenuItem>
        </TextField>

        
        <Controller
          name="deadline"
          control={control}
          rules={{ required: "Deadline is required" }}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Deadline"
                {...field}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    error={!!errors.deadline}
                    helperText={errors.deadline?.message}
                  />
                )}
              />
            </LocalizationProvider>
          )}
        />

        
        <TextField
          fullWidth
          type="number"
          label="Max Marks"
          {...register("max_marks", {
            required: "Max marks is required",
            min: { value: 1, message: "Must be at least 1" },
          })}
          error={!!errors.max_marks}
          helperText={errors.max_marks?.message}
          margin="normal"
        />

        
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Upload Reference File
          <input
            type="file"
            hidden
            {...register("reference_files")}
          />
        </Button>

        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Create Assignment
        </Button>
      </form>
    </Box>
  );
};

export default AssignmentCreate;
