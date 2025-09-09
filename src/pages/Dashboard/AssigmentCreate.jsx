import React , { useState } from "react";
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
import { useNavigate } from "react-router-dom";

const AssignmentCreate = () => {
  const [deadline, setDeadline] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const now = new Date();
      if (!deadline || deadline <= now) {
        setError("Deadline must be in the future.");
        return;
      }

      if (fileError) {    
        return;
      }
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
      
      setError("");
      console.log("Form submitted with deadline:", deadline);

      const response = await axiosInstance.post("/assignments/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Assignment created:", response.data);
      reset();
      setFileName("");
      navigate("/teacher-assignments");
    } catch (error) {
      console.error("Error creating assignment:", error.response?.data || error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let errorMsg = "";

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
    ];
    if (!allowedTypes.includes(file.type)) {
      errorMsg = "Invalid file type. Allowed: PDF, JPEG, PNG, PPTX, PPT";
    }

    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      errorMsg = "File size must be less than 5MB.";
    }

    if (errorMsg) {
      setFileError(errorMsg);
      setFileName("");
    } else {
      setFileError("");
      setFileName(file.name);
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
          // select
          fullWidth
          // defaultValue="1"
          label="Grade"
          {...register("grade", { required: "Grade is required" })}
          error={!!errors.grade}
          helperText={errors.grade?.message}
          margin="normal"
        >
          {/* {[...Array(12)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))} */}
        </TextField>

        
        <Controller
          name="deadline"
          control={control}
          defaultValue={null}
          rules={{ required: "Deadline is required" }}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Deadline"
                value={field.value ?? null}   
                onChange={(newValue) => {
                  field.onChange(newValue);
                  setDeadline(newValue);
                }}
                minDateTime={new Date()}
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
          helperText={errors.deadline?.message || error}
          margin="normal"
        />

        
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Upload Reference File
          <input
            type="file"
            hidden
            {...register("reference_files")}
            onChange={handleFileChange}
          />
        </Button>
        {fileName && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected file: {fileName}
          </Typography>
        )}
        {fileError && (   
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {fileError}
          </Typography>
        )}
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
