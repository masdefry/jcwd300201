interface IInputCustomProps {
    type?: string
    placeholder?: string
    name: string
    id: string
    readOnly?: boolean
    value?: string | number
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
    required?: boolean
    disabled?: boolean
}

export default function InputCustom(
    {
        type = 'text',
        placeholder = 'Masukan input disini',
        name,
        id,
        readOnly = false,
        value,
        onChange,
        onBlur,
        onFocus,
        required = false,
        disabled = false,
    }: IInputCustomProps
) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            name={name}
            id={id}
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            required={required}
            disabled={disabled}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-400 text-sm pr-10"
        />
    )
}