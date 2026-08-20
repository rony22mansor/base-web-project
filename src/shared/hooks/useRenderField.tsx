import { IFormField } from "@/src/core/types/generalTypes";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import { CheckboxField } from "../components/fields/CheckboxField";
import { DatePickerField } from "../components/fields/DatePickerField";
import FilleField from "../components/fields/FilleField";
import InputField from "../components/fields/InputField";
import { RadioGroupField } from "../components/fields/RadioGroupField";
import { SelectRequierd } from "../components/fields/SelectRequierd";
import TextAreaField from "../components/fields/TextAreaField";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useRenderField = <T extends Record<string, any>>() => {
  const renderField = ({
    field,
    register,
    control,
    errors,
    extraProps,
  }: {
    field: IFormField<T>;
    register?: UseFormRegister<T>;
    setValue?: UseFormSetValue<T>;
    reset?: UseFormReset<T>;
    control?: Control<T>;
    errors?: FieldErrors<T>;
    extraProps?: Record<string, unknown>;
  }) => {
    const error = errors?.[field.name as keyof T];

    // The field components are generic over their own form shape, so the
    // control has to cross an `any` boundary here. Contained to this line.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sharedControl = control as Control<any> | undefined;

    switch (field?.type) {
      case "email":
      case "text":
      case "password":
      case "hidden":
        return (
          <InputField
            required={field?.required}
            register={register}
            key={String(field.name)}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
            disabled={field.disabled}
            defaultValue={field.defaultValue}
            readOnly={field.readOnly}
            dir={field.dir}
            autoFocus={field.autoFocus}
            classNameWrapper={field.classNameWrapper}
            maxLength={field.maxLength}
            error={error ? error : undefined}
            classNameInputExtra={field.classNameInputExtra}
            labelExtraClassName={field.labelExtraClassName}
            onChange={field.onChange}
            icon={field.icon}
            numbersOnly={field.numbersOnly}
            {...extraProps}
          />
        );
      case "textarea":
        return (
          <TextAreaField
            required={field?.required}
            register={register}
            key={String(field.name)}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            classNameWrapper={field.classNameWrapper}
            disabled={field.disabled}
            defaultValue={field.defaultValue}
            readOnly={field.readOnly}
            autoFocus={field.autoFocus}
            maxLength={field.maxLength}
            error={error ? error : undefined}
            classNameInputExtra={field.classNameInputExtra}
            labelExtraClassName={field.labelExtraClassName}
            {...extraProps}
          />
        );
      case "selectrequierd":
        return (
          <SelectRequierd
            required={field?.required}
            key={String(field.name)}
            name={String(field.name)}
            label={String(field.label)}
            placeholder={field.placeholder ?? ""}
            options={field.options ?? []}
            disabled={field.disabled}
            classNameInputExtra={field.classNameInputExtra}
            classNameSelectContent={field.classNameSelectContent}
            labelExtraClassName={field.labelExtraClassName}
            control={sharedControl}
            dir={field.dir}
            error={error ? error : undefined}
            icon={field.icon}
            showClearIcon={field.showClearIcon}
            {...extraProps}
          />
        );
      case "radio":
        return (
          <RadioGroupField
            required={field?.required}
            key={String(field.name)}
            name={String(field.name)}
            label={String(field.label)}
            options={field.options ?? []}
            defaultValue={field.defaultValue}
            disabled={field.disabled}
            classNameWrapper={field.classNameWrapper}
            classNameRadioGroupItem={field.classNameRadioGroupItem}
            labelExtraClassName={field.labelExtraClassName}
            control={sharedControl}
            error={error ? error : undefined}
            RadioGroupClassName={field.RadioGroupClassName}
            {...extraProps}
          />
        );
      case "checkbox":
        return (
          <CheckboxField
            required={field?.required}
            key={String(field.name)}
            name={String(field.name)}
            label={String(field.label)}
            control={sharedControl}
            disabled={field.disabled}
            classNameWrapper={field.classNameWrapper}
            labelExtraClassName={field.labelExtraClassName}
            error={error ? error : undefined}
            {...extraProps}
          />
        );
      case "date":
        return (
          <DatePickerField
            required={field?.required}
            control={sharedControl}
            key={String(field.name)}
            name={String(field.name)}
            label={String(field.label)}
            error={error ? error : undefined}
            minDate={field.minDate}
            maxDate={field.maxDate}
            placeholder={String(field.placeholder)}
            showYearDropdown={field.showYearDropdown}
            datePickerIsClearable={field.datePickerIsClearable}
            {...extraProps}
          />
        );
      case "file":
        return (
          <FilleField
            register={register}
            name={field.name}
            accept={field.accept}
            disabled={field.disabled}
            error={error ? error : undefined}
            label={String(field.label)}
            key={String(field.name)}
            placeholder={field.placeholder ?? ""}
            maxSizeMB={field.maxSizeMB}
            multiple={field.multiple}
            classNameWrapper={field.classNameWrapper}
            onchangeFile={field.onchangeFile}
            readOnly={field.readOnly}
            fileName={field.fileName}
            {...extraProps}
          />
        );
      default:
        return null;
    }
  };

  return { renderField };
};
