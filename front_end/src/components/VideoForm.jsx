import React, { useState, useEffect } from 'react';

const VIDEO_TYPES = ['FILM', 'SERIE', 'DOCUMENTAIRE'];
const VIDEO_CATEGORIES = ['ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'ROMANCE', 'THRILLER', 'SCIFI', 'ANIMATION', 'DOCUMENTARY'];

const EMPTY_FORM = {
    title: '',
    description: '',
    thumbnailUrl: '',
    trailerUrl: '',
    duration: '',
    releaseYear: new Date().getFullYear(),
    type: 'FILM',
    category: 'ACTION',
    rating: '',
    director: '',
    castMembers: '',
};

const VideoForm = ({ initialData = null, onSubmit, onCancel, loading = false }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || '',
                description: initialData.description || '',
                thumbnailUrl: initialData.thumbnailUrl || '',
                trailerUrl: initialData.trailerUrl || '',
                duration: initialData.duration ?? '',
                releaseYear: initialData.releaseYear ?? new Date().getFullYear(),
                type: initialData.type || 'FILM',
                category: initialData.category || 'ACTION',
                rating: initialData.rating ?? '',
                director: initialData.director || '',
                castMembers: initialData.castMembers || '',
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required.';
        if (!form.description.trim()) errs.description = 'Description is required.';
        if (!form.trailerUrl.trim()) errs.trailerUrl = 'Trailer URL is required.';
        if (!form.releaseYear || isNaN(form.releaseYear)) errs.releaseYear = 'Valid release year required.';
        if (form.rating !== '' && (isNaN(form.rating) || form.rating < 0 || form.rating > 10))
            errs.rating = 'Rating must be between 0 and 10.';
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        onSubmit({
            ...form,
            duration: form.duration !== '' ? parseInt(form.duration) : null,
            releaseYear: parseInt(form.releaseYear),
            rating: form.rating !== '' ? parseFloat(form.rating) : null,
        });
    };

    const inputClass = "w-full p-3 bg-bg-hover border border-transparent rounded-md text-text-primary text-sm focus:outline-none focus:border-brand placeholder-text-muted transition-colors";
    const labelClass = "block text-sm font-medium text-text-secondary mb-1";
    const errorClass = "text-xs text-red-400 mt-1";
    const selectClass = `${inputClass} cursor-pointer`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4" id="video-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                    <label className={labelClass}>Title *</label>
                    <input id="video-title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Inception" className={inputClass} />
                    {errors.title && <p className={errorClass}>{errors.title}</p>}
                </div>

                {/* Director */}
                <div>
                    <label className={labelClass}>Director</label>
                    <input id="video-director" name="director" value={form.director} onChange={handleChange} placeholder="e.g. Christopher Nolan" className={inputClass} />
                </div>

                {/* Type */}
                <div>
                    <label className={labelClass}>Type *</label>
                    <select id="video-type" name="type" value={form.type} onChange={handleChange} className={selectClass}>
                        {VIDEO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Category */}
                <div>
                    <label className={labelClass}>Category *</label>
                    <select id="video-category" name="category" value={form.category} onChange={handleChange} className={selectClass}>
                        {VIDEO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Release Year */}
                <div>
                    <label className={labelClass}>Release Year *</label>
                    <input id="video-releaseYear" name="releaseYear" type="number" value={form.releaseYear} onChange={handleChange} min="1888" max="2099" className={inputClass} />
                    {errors.releaseYear && <p className={errorClass}>{errors.releaseYear}</p>}
                </div>

                {/* Duration */}
                <div>
                    <label className={labelClass}>Duration (minutes)</label>
                    <input id="video-duration" name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="e.g. 148" min="1" className={inputClass} />
                </div>

                {/* Rating */}
                <div>
                    <label className={labelClass}>Rating (0–10)</label>
                    <input id="video-rating" name="rating" type="number" value={form.rating} onChange={handleChange} placeholder="e.g. 8.8" min="0" max="10" step="0.1" className={inputClass} />
                    {errors.rating && <p className={errorClass}>{errors.rating}</p>}
                </div>

                {/* Cast Members */}
                <div>
                    <label className={labelClass}>Cast Members</label>
                    <input id="video-castMembers" name="castMembers" value={form.castMembers} onChange={handleChange} placeholder="e.g. Leo, Cillian Murphy" className={inputClass} />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className={labelClass}>Description *</label>
                <textarea id="video-description" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief synopsis of the video..." className={`${inputClass} resize-none`} />
                {errors.description && <p className={errorClass}>{errors.description}</p>}
            </div>

            {/* Thumbnail URL */}
            <div>
                <label className={labelClass}>Thumbnail URL</label>
                <input id="video-thumbnailUrl" name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} placeholder="https://..." className={inputClass} />
            </div>

            {/* Trailer URL */}
            <div>
                <label className={labelClass}>Trailer URL *</label>
                <input id="video-trailerUrl" name="trailerUrl" value={form.trailerUrl} onChange={handleChange} placeholder="https://youtube.com/embed/..." className={inputClass} />
                {errors.trailerUrl && <p className={errorClass}>{errors.trailerUrl}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button
                    id="video-form-submit"
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-brand hover:bg-brand/80 text-white font-semibold rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving…' : initialData ? 'Update Video' : 'Create Video'}
                </button>
                {onCancel && (
                    <button
                        id="video-form-cancel"
                        type="button"
                        onClick={onCancel}
                        className="py-3 px-6 bg-bg-hover hover:bg-bg-secondary text-text-secondary font-medium rounded-md transition-colors border border-bg-hover"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default VideoForm;
