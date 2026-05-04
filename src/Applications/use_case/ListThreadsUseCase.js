class ListThreadsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute({ page = 1, limit = 10 }) {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(50, Math.max(10, parseInt(limit, 10) || 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const { threads, total } = await this._threadRepository.listThreads(parsedLimit, offset);

    const totalPage = Math.ceil(total / parsedLimit);

    return {
      threads,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPage,
      },
    };
  }
}

export default ListThreadsUseCase;