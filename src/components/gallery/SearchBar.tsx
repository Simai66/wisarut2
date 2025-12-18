import { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    initialValue?: string;
}

/**
 * Search bar with debounced input
 */
export const SearchBar = ({
    onSearch,
    placeholder = 'Search photos...',
    initialValue = '',
}: SearchBarProps) => {
    const [value, setValue] = useState(initialValue);
    const debouncedValue = useDebounce(value, 300);

    // Trigger search on debounced value change
    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    const handleClear = () => {
        setValue('');
    };

    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search color="action" />
                    </InputAdornment>
                ),
                endAdornment: value ? (
                    <InputAdornment position="end">
                        <Clear
                            sx={{ cursor: 'pointer' }}
                            onClick={handleClear}
                            color="action"
                        />
                    </InputAdornment>
                ) : null,
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                },
            }}
        />
    );
};
