/**
 * SMA Labschool UNESA 1 - Media & News Helpers
 * Supports Google Drive images & videos, Instagram repost links, YouTube, and direct video files.
 */

/**
 * Extract Google Drive file ID from various URL formats
 */
export function extractGoogleDriveId(url = '') {
  if (!url) return null;
  const match = url.match(
    /(?:drive|docs)\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^&]+&)*id=|thumbnail\?id=)([a-zA-Z0-9_-]+)/
  );
  return match ? match[1] : null;
}

/**
 * Extract Instagram shortcode from post, reel, or TV URL
 */
export function extractInstagramId(url = '') {
  if (!url) return null;
  const match = url.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

/**
 * Extract YouTube video ID from standard watch, shorts, or shortlinks
 */
export function extractYouTubeId(url = '') {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

/**
 * Detect media type from URL and explicit hint
 */
export function detectMediaType(url = '', explicitType = '') {
  if (explicitType && ['image', 'video', 'instagram', 'youtube'].includes(explicitType)) {
    return explicitType;
  }
  if (!url) return 'image';

  if (extractInstagramId(url)) return 'instagram';
  if (extractYouTubeId(url)) return 'youtube';

  // Check direct video file extensions
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)) {
    return 'video';
  }

  // Google Drive preview URL or file marked as video
  if (extractGoogleDriveId(url) && url.includes('/preview')) {
    return 'video';
  }

  return 'image';
}

/**
 * Resolve displayable media information for cards, sliders, and story viewer
 */
export function resolveMediaInfo(item = {}) {
  const rawUrl = item.imageUrl || item.image_url || item.mediaUrl || item.media_url || item.videoUrl || item.video_url || item.instagramUrl || item.instagram_url || '';
  const explicitType = item.mediaType || item.media_type || '';
  const mediaType = detectMediaType(rawUrl, explicitType);

  const driveId = extractGoogleDriveId(rawUrl);
  const igId = extractInstagramId(rawUrl || item.instagramUrl || item.instagram_url);
  const ytId = extractYouTubeId(rawUrl || item.videoUrl || item.video_url);

  // If user provided an explicit cover or thumbnail
  const customCover = item.coverUrl || item.cover_url || item.thumbnailUrl;

  if (mediaType === 'instagram' && igId) {
    return {
      type: 'instagram',
      id: igId,
      originalUrl: `https://www.instagram.com/p/${igId}/`,
      embedUrl: `https://www.instagram.com/p/${igId}/embed/`,
      thumbnailUrl: customCover || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop',
      isExternalEmbed: true,
    };
  }

  if (mediaType === 'youtube' && ytId) {
    return {
      type: 'youtube',
      id: ytId,
      originalUrl: `https://www.youtube.com/watch?v=${ytId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=0&rel=0`,
      thumbnailUrl: customCover || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      isExternalEmbed: true,
    };
  }

  if (mediaType === 'video') {
    if (driveId) {
      return {
        type: 'video',
        isDriveVideo: true,
        embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
        originalUrl: rawUrl,
        thumbnailUrl: customCover || `https://lh3.googleusercontent.com/d/${driveId}`,
      };
    }
    return {
      type: 'video',
      url: rawUrl,
      originalUrl: rawUrl,
      thumbnailUrl: customCover || '',
    };
  }

  // Default: Image
  let finalImageUrl = rawUrl;
  if (driveId) {
    finalImageUrl = `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  return {
    type: 'image',
    url: finalImageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    thumbnailUrl: finalImageUrl,
  };
}

/**
 * Determine if news item has expired based on deadline
 */
export function getDeadlineInfo(deadlineAt, postType = 'forever') {
  if (postType === 'forever' || !deadlineAt) {
    return {
      isForever: true,
      isExpired: false,
      badgeText: 'Selamanya',
      formattedDate: null,
      remainingDays: null,
      color: 'slate',
    };
  }

  const deadlineDate = new Date(deadlineAt);
  if (isNaN(deadlineDate.getTime())) {
    return {
      isForever: true,
      isExpired: false,
      badgeText: 'Selamanya',
      formattedDate: null,
      remainingDays: null,
      color: 'slate',
    };
  }

  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const isExpired = diffMs <= 0;

  const formattedDate = deadlineDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (isExpired) {
    return {
      isForever: false,
      isExpired: true,
      badgeText: 'Kadaluarsa',
      formattedDate,
      remainingDays: 0,
      color: 'red',
    };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let badgeText = '';
  if (diffHours < 24) {
    badgeText = `Sisa ${diffHours} Jam`;
  } else if (diffDays === 1) {
    badgeText = 'Berakhir Besok';
  } else {
    badgeText = `Sisa ${diffDays} Hari`;
  }

  return {
    isForever: false,
    isExpired: false,
    badgeText,
    formattedDate,
    remainingDays: diffDays,
    color: diffDays <= 3 ? 'amber' : 'orange',
  };
}

/**
 * Filter news items that should be shown on the public site
 */
export function isNewsActiveOnPublic(item) {
  const postType = item.postType || item.post_type || 'forever';
  const deadlineAt = item.deadlineAt || item.deadline_at;

  if (postType === 'forever' || !deadlineAt) return true;

  const deadline = new Date(deadlineAt);
  if (isNaN(deadline.getTime())) return true;

  // Active if deadline is in the future
  return deadline.getTime() > Date.now();
}

