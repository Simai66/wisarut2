import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import type { Album } from '@/types';

interface AlbumFilterProps {
    albums: Album[];
    selectedAlbumId: string | null;
    onAlbumChange: (albumId: string | null) => void;
}

/**
 * Album/category filter dropdown
 */
export const AlbumFilter = ({
    albums,
    selectedAlbumId,
    onAlbumChange,
}: AlbumFilterProps) => {
    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        onAlbumChange(value === 'all' ? null : value);
    };

    return (
        <FormControl fullWidth size="medium">
            <InputLabel id="album-filter-label">Album</InputLabel>
            <Select
                labelId="album-filter-label"
                value={selectedAlbumId ?? 'all'}
                onChange={handleChange}
                label="Album"
                sx={{ backgroundColor: 'background.paper' }}
            >
                <MenuItem value="all">All Photos</MenuItem>
                {albums.map((album) => (
                    <MenuItem key={album.id} value={album.id}>
                        {album.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
