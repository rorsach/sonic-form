import React from 'react';

/**
 * useForm takes a map of 'validationOptions' for any form field to validate.
 * The field's `name` attribute maps to a `ValidationOption` object
 * containing validation functions to test the field's value. This hook provides event
 * handlers that can be attached to the form to trigger validation.
 */
export function useForm({
    formValues,
    setFormValues,
    errors,
    setErrors,
    validationOptions,
}: {
    // TODO: make this generic for better type safety
    formValues: FormValues,
    setFormValues: any,
    errors: FormErrors,
    setErrors: any,
    validationOptions: { [key: string]: ValidationOption }
}): UseForm {
    const getFieldName = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): string | undefined => {
        if (event.target.name === null && event.target.getAttribute('name') === null) {
            console.error('You must specify a name for this form field.');
            return;
        }

        return event.target.name || event.target.getAttribute('name') as string;
    };

    const setValueFromChangeEvent = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const name = getFieldName(event);

        if (!name) {
            return;
        }

        if (event.target.value === undefined) {
            console.warn(`The changeEvent value of ${name} is undefined. Was it a programmatic event?`);
            return;
        }

        setFormValues((prevState: FormValues) => ({
            ...prevState,
            [name]: event.target.value as string,
        }));
    };

    const validate = async (pname: string, currentValue?: any): Promise<boolean> => {
        let errorMessage = '';

        const nameToValidate = validationOptions[pname].nestedFieldOf || pname;
        // If `nestedFieldOf` is provided, run that validation instead.
        // `nestedFieldOf` is used for auxiliary inputs (like hour/minute) that validate against a main field (like date).
        const namedValidationOptions = validationOptions[nameToValidate];
        const validations = namedValidationOptions?.validations ? namedValidationOptions.validations : [];

        // Use the provided current value if available, otherwise fall back to form values
        const valueToValidate = currentValue !== undefined ? currentValue : formValues[nameToValidate];

        for (const validation of validations) {
            try {
                const result = await Promise.resolve(validation.isValid(valueToValidate));
                if (!result) {
                    errorMessage = validation.errorMessage;
                    // Current behavior: do not short-circuit
                }
            } catch (e) {
                console.error(`Validation error for ${nameToValidate}:`, e);
                // TODO: consider bubbling this error up instead of failing silently
                errorMessage = validation.errorMessage || 'Validation failed';
            }
        }

        setErrors((prevState: any) => ({
            ...prevState,
            [nameToValidate]: errorMessage,
        }));

        return errorMessage === '';
    };

    const validateFromEvent = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const name = getFieldName(event);
        if (name) {
            // Pass the new value from the event to validation
            validate(name, event.target.value);
        }
    };

    const validateRelatedFields = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const name = getFieldName(event);
        if (!name) {
            return;
        }

        const fieldConfig = validationOptions[name];

        // Mutual exclusivity check (only in dev mode)
        if (process.env.NODE_ENV !== 'production') {
            if (fieldConfig.nestedFieldOf && fieldConfig.relatedFields?.length) {
                throw new Error(
                    `Field "${name}" cannot define both "nestedFieldOf" and "relatedFields". 
                     These are mutually exclusive:
                     - Use "nestedFieldOf" for auxiliary inputs that map to a main field.
                     - Use "relatedFields" for primary fields that affect others.`,
                );
            }
        }

        if (fieldConfig.nestedFieldOf) {
            // Auxiliary field: validate its target only
            validate(fieldConfig.nestedFieldOf);
            return;
        }

        // Primary field: validate its related fields only
        for (const fieldName of fieldConfig.relatedFields || []) {
            if (errors[fieldName]) {
                validate(fieldName);
            }
        }
    };

    // Pluggable handler for external/custom field types (e.g., DatePicker)
    const handleCustomChange = (field: string, value: any): void => {
        setFormValues((prevState: FormValues) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleDatePickerChange = (event: any): void => {
        if (!event.detail) {
            return;
        }

        const selectedDate = new Date(event.detail);
        handleCustomChange(event.target.name, selectedDate);
    };

    const handleDropdownChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setValueFromChangeEvent(event);
        validateFromEvent(event);
        validateRelatedFields(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setValueFromChangeEvent(event);
        validateFromEvent(event);
        validateRelatedFields(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
        validateFromEvent(event);
        validateRelatedFields(event);
    };

    const validateAll = async (): Promise<boolean> => {
        let isFormValid = true;
        for (const name in validationOptions) {
            isFormValid = (await validate(name)) && isFormValid;
        }
        return isFormValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<boolean> => {
        event.preventDefault();
        const isFormValid = await validateAll();
        return isFormValid;
    };

    return {
        handleDatePickerChange,
        handleDropdownChange,
        handleChange,
        handleBlur,
        handleCustomChange,
        handleSubmit,
        validateAll, // newly exposed
    };
}

/** Validation options mapped to any field name that needs validation. */
export interface ValidationOption {
    /** When this field changes, run the provided list of 'Validation' on the field's value. */
    validations?: Array<Validation>;
    /** When this field changes, also run validation on the 'relatedFields', if there are validation errors. */
    relatedFields?: string[];
    /** When this field changes, call validation on the named 'nestedFieldOf' field instead. Used for auxiliary inputs (like hour/minute) that validate against a main field (like date). */
    nestedFieldOf?: string;
}

/** Signature of a validation function and corresponding error message */
export interface Validation {
    isValid: (arg: any) => boolean | Promise<boolean>;
    errorMessage: string;
}

/** React state object returned by useState and passed into the useForm hook by the caller, to store form values. */
export interface FormValues {
    [key: string]: any;
}

/** React state object returned by useState and passed into the useForm hook by the caller, to store form validation error messages. */
export interface FormErrors {
    [key: string]: string;
}

/** A map of event handlers to attach to form field events. */
interface UseForm {
    /** Attach `handleDatePickerChange` to a onInput of a DatePicker */
    handleDatePickerChange: (event: any) => void;
    /** Attach `handleDropdownChange` to a onChange of a Dropdown */
    handleDropdownChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    /** Attach `handleChange` to input onChange events. */
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    /** Attach `handleBlur` to input onBlur events. */
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Pluggable handler for arbitrary field value changes */
    handleCustomChange: (field: string, value: any) => void;
    /** Attach `handleSubmit` to any element that should trigger whole form validation. */
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<boolean>;
    /** Validate all fields manually. */
    validateAll: () => Promise<boolean>;
}
