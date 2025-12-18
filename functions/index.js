const functions = require('firebase-functions');
const fetch = require('node-fetch');

// ImgBB API configuration
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

/**
 * Cloud Function to upload images to ImgBB
 * This bypasses CORS restrictions by making server-to-server requests
 */
exports.uploadToImgbb = functions.https.onCall(async (data, context) => {
    // Check if user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated to upload images'
        );
    }

    const { imageBase64, apiKey } = data;

    if (!imageBase64) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Image data is required'
        );
    }

    if (!apiKey) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'API key is required'
        );
    }

    try {
        // Create form data for ImgBB API
        const formData = new URLSearchParams();
        formData.append('image', imageBase64);
        formData.append('key', apiKey);

        const response = await fetch(IMGBB_API_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ImgBB API error:', errorText);
            throw new functions.https.HttpsError(
                'internal',
                'Failed to upload image to ImgBB'
            );
        }

        const result = await response.json();

        if (!result.success) {
            throw new functions.https.HttpsError(
                'internal',
                result.error?.message || 'Failed to upload image'
            );
        }

        // Return the URLs from ImgBB
        return {
            url: result.data.url,
            thumbnail: result.data.thumb?.url || result.data.medium?.url || result.data.url,
            deleteUrl: result.data.delete_url,
        };
    } catch (error) {
        console.error('Upload error:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError(
            'internal',
            'An unexpected error occurred during upload'
        );
    }
});
