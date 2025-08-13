// src/components/FilterForm.tsx
import React from "react";
import { Box, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { Formik, Form, Field,type FormikHelpers } from "formik";
import * as Yup from "yup";

export interface FilterValues {
  minPrice: number | "" | null;
  maxPrice: number | "" | null;
  minVolume: number | "" | null;
  onlyGainers: boolean;
}

interface Props {
  initialValues?: FilterValues;
  onApply: (values: {
    minPrice?: number;
    maxPrice?: number;
    minVolume?: number;
    onlyGainers: boolean;
  }) => void;
  onClear?: () => void;
}

const defaultValues: FilterValues = {
  minPrice: "",
  maxPrice: "",
  minVolume: "",
  onlyGainers: false,
};

const transformEmptyToNull = (value: any) => (value === "" ? null : value);

const validationSchema = Yup.object().shape({
  minPrice: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .min(0, "Має бути ≥ 0"),
  maxPrice: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .min(0, "Має бути ≥ 0")
    // FIX: Використовуємо деструктуризацію масиву для отримання значення minPrice
    .when("minPrice", ([minPrice]: (number | null)[], schema) => {
      return minPrice != null 
        ? schema.min(minPrice, "Максимальна ціна має бути ≥ мінімальної") 
        : schema;
    }),
  minVolume: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .min(0, "Має бути ≥ 0"),
  onlyGainers: Yup.boolean(),
});

const FilterForm: React.FC<Props> = ({ initialValues = defaultValues, onApply, onClear }) => {
  const handleSubmit = (
    values: FilterValues,
    { setSubmitting }: FormikHelpers<FilterValues>
  ) => {
    const payload = {
      minPrice: values.minPrice === "" || values.minPrice == null ? undefined : Number(values.minPrice),
      maxPrice: values.maxPrice === "" || values.maxPrice == null ? undefined : Number(values.maxPrice),
      minVolume: values.minVolume === "" || values.minVolume == null ? undefined : Number(values.minVolume),
      onlyGainers: !!values.onlyGainers,
    };
    onApply(payload);
    setSubmitting(false);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 420 }}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleReset, isSubmitting }) => (
          <Form>
            <Field name="minPrice">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label="Мін. ціна (USD)"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error ? meta.error : ""}
                  inputProps={{ min: 0, step: "any" }}
                />
              )}
            </Field>

            <Field name="maxPrice">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label="Макс. ціна (USD)"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error ? meta.error : ""}
                  inputProps={{ min: 0, step: "any" }}
                />
              )}
            </Field>

            <Field name="minVolume">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label="Мін. обсяг торгів (24h)"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error ? meta.error : ""}
                  inputProps={{ min: 0, step: "any" }}
                />
              )}
            </Field>

            <Field name="onlyGainers">
              {({ field }: any) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={!!field.value} />}
                  label="Показувати тільки ті, що зросли за 24h"
                />
              )}
            </Field>

            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Застосувати
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  handleReset();
                  if (onClear) onClear();
                }}
              >
                Очистити
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default FilterForm;
