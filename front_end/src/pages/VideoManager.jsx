import React, { useState, useEffect, useCallback } from 'react';
import { videoService } from '../services/videoService';
import VideoForm from '../components/VideoForm';
import { Plus, Pencil, Trash2, Film, AlertCircle, X, ChevronRight } from 'lucide-react';

// ─── Small reusable pieces ──────────────────────────────────────────────────

const Badge = ({ children, color = 'indigo' }) => {
    const colors = {
        indigo: 'bg-indigo-500/10 text-indigo-400',
        teal: 'bg-teal-500/10 text-teal-400',
        amber: 'bg-amber-500/10 text-amber-400',
    };
    return (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${colors[color] ?? colors.indigo}`}>
            {children}
        </span>
    );
};

const typeColor = { FILM: 'indigo', SERIE: 'teal', DOCUMENTAIRE: 'amber' };

// ─── Confirm-delete modal ────────────────────────────────────────────────────

const DeleteConfirm = ({ video, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-bg-secondary border border-bg-hover rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="text-red-400 shrink-0" size={22} />
                <h3 className="text-text-primary font-semibold text-lg">Delete Video</h3>
            </div>
            <p className="text-text-secondary text-sm mb-6">
                Are you sure you want to delete <strong className="text-text-primary">"{video.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
                <button
                    id="confirm-delete-btn"
                    onClick={onConfirm}
                    className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors text-sm"
                >
                    Delete
                </button>
                <button
                    id="cancel-delete-btn"
                    onClick={onCancel}
                    className="flex-1 py-2.5 px-4 bg-bg-hover hover:bg-bg-secondary text-text-secondary font-medium rounded-md transition-colors text-sm border border-bg-hover"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

// ─── VideoManager page ───────────────────────────────────────────────────────

const VideoManager = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Panel state: null = list only, 'create' = add form, id = edit form
    const [panel, setPanel] = useState(null);
    const [editingVideo, setEditingVideo] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3500);
    };

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await videoService.getAllVideos();
            setVideos(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch videos. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchVideos(); }, [fetchVideos]);

    const openCreate = () => { setEditingVideo(null); setPanel('create'); };
    const openEdit = (video) => { setEditingVideo(video); setPanel('edit'); };
    const closePanel = () => { setPanel(null); setEditingVideo(null); };

    const handleCreate = async (formData) => {
        setFormLoading(true);
        try {
            const created = await videoService.createVideo(formData);
            setVideos((prev) => [created, ...prev]);
            closePanel();
            showSuccess(`✓ "${created.title}" was added successfully.`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create video.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdate = async (formData) => {
        setFormLoading(true);
        try {
            const updated = await videoService.updateVideo(editingVideo.id, formData);
            setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
            closePanel();
            showSuccess(`✓ "${updated.title}" was updated successfully.`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update video.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await videoService.deleteVideo(deleteTarget.id);
            setVideos((prev) => prev.filter((v) => v.id !== deleteTarget.id));
            showSuccess(`✓ "${deleteTarget.title}" was deleted.`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete video.');
        } finally {
            setDeleteTarget(null);
        }
    };

    // ── Form panel title ──
    const panelTitle = panel === 'create' ? 'Add New Video' : `Edit: ${editingVideo?.title ?? ''}`;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Video Manager</h1>
                    <p className="text-text-secondary text-sm mt-0.5">{videos.length} video{videos.length !== 1 ? 's' : ''} in the library</p>
                </div>
                <button
                    id="add-video-btn"
                    onClick={openCreate}
                    className="flex items-center gap-2 py-2.5 px-4 bg-brand hover:bg-brand/80 text-white font-semibold rounded-md transition-colors text-sm"
                >
                    <Plus size={16} />
                    Add Video
                </button>
            </div>

            {/* Toast notifications */}
            {successMsg && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-sm">
                    {successMsg}
                </div>
            )}
            {error && (
                <div className="mb-4 flex items-center justify-between gap-2 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-sm">
                    <span>{error}</span>
                    <button onClick={() => setError('')}><X size={14} /></button>
                </div>
            )}

            {/* Slide-in form panel ──────────────────────── */}
            {panel && (
                <div className="mb-6 bg-bg-secondary border border-bg-hover rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-bg-hover">
                        <div className="flex items-center gap-2 text-text-primary font-semibold">
                            <Film size={18} className="text-brand" />
                            {panelTitle}
                        </div>
                        <button
                            id="close-form-btn"
                            onClick={closePanel}
                            className="text-text-muted hover:text-text-primary transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6">
                        <VideoForm
                            initialData={editingVideo}
                            onSubmit={panel === 'edit' ? handleUpdate : handleCreate}
                            onCancel={closePanel}
                            loading={formLoading}
                        />
                    </div>
                </div>
            )}

            {/* Video list ───────────────────────────────── */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
                    <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4" />
                    Loading videos…
                </div>
            ) : videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
                    <Film size={48} className="mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-1">No videos yet</p>
                    <p className="text-sm mb-4">Click "Add Video" to create your first entry.</p>
                </div>
            ) : (
                <div className="bg-bg-secondary border border-bg-hover rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-bg-hover text-text-muted text-left">
                                <th className="px-5 py-3 font-medium">Title</th>
                                <th className="px-5 py-3 font-medium hidden md:table-cell">Type</th>
                                <th className="px-5 py-3 font-medium hidden lg:table-cell">Year</th>
                                <th className="px-5 py-3 font-medium hidden lg:table-cell">Rating</th>
                                <th className="px-5 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-bg-hover">
                            {videos.map((video) => (
                                <tr key={video.id} className="hover:bg-bg-hover/40 transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            {video.thumbnailUrl ? (
                                                <img
                                                    src={video.thumbnailUrl}
                                                    alt={video.title}
                                                    className="w-12 h-8 object-cover rounded shrink-0 bg-bg-hover"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="w-12 h-8 bg-bg-hover rounded shrink-0 flex items-center justify-center">
                                                    <Film size={14} className="text-text-muted" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-text-primary leading-tight line-clamp-1">{video.title}</p>
                                                {video.director && <p className="text-[11px] text-text-muted">{video.director}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 hidden md:table-cell">
                                        <Badge color={typeColor[video.type]}>{video.type}</Badge>
                                    </td>
                                    <td className="px-5 py-3.5 hidden lg:table-cell text-text-secondary">{video.releaseYear}</td>
                                    <td className="px-5 py-3.5 hidden lg:table-cell text-text-secondary">
                                        {video.rating != null ? `⭐ ${video.rating.toFixed(1)}` : '—'}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                id={`edit-video-${video.id}`}
                                                onClick={() => openEdit(video)}
                                                title="Edit"
                                                className="p-2 rounded hover:bg-brand/10 hover:text-brand text-text-muted transition-colors"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                id={`delete-video-${video.id}`}
                                                onClick={() => setDeleteTarget(video)}
                                                title="Delete"
                                                className="p-2 rounded hover:bg-red-500/10 hover:text-red-400 text-text-muted transition-colors"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete confirmation modal */}
            {deleteTarget && (
                <DeleteConfirm
                    video={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
};

export default VideoManager;
