import { bookmarksRepository } from "./bookmarks.repository.js";
export const bookmarksService = {
    async toggle(userId, wordId) {
        const existing = await bookmarksRepository.findProgress(userId, wordId);
        if (existing) {
            const next = !existing.isBookmarked;
            await bookmarksRepository.updateBookmark(existing.id, next);
            return { isBookmarked: next };
        }
        await bookmarksRepository.createBookmarked(userId, wordId);
        return { isBookmarked: true };
    },
    list(userId) {
        return bookmarksRepository.listBookmarked(userId);
    },
};
