import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import ListThreadsUseCase from '../ListThreadsUseCase';

describe('ListThreadsUseCase', () => {
  const mockRawQuery = {
    threads: [
      {
        id: 'thread-123',
        title: 'Sebuah thread',
        body: 'Isi dari sebuah thread',
        date: '2026-04-16T05:29:42.565Z',
        username: 'dicoding',
        commentCount: 2,
      },
      {
        id: 'thread-456',
        title: 'Sebuah thread',
        body: 'Isi dari sebuah thread',
        date: '2026-04-16T05:29:42.565Z',
        username: 'dicoding2',
        commentCount: 30,
      },
    ],
    total: 2,
  };

  let mockThreadRepository;
  let listThreadsUseCase;

  it('should list threads with default pagination correctly', async () => {
    // Arrange
    mockThreadRepository = new ThreadRepository();
    mockThreadRepository.listThreads = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockRawQuery));

    listThreadsUseCase = new ListThreadsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await listThreadsUseCase.execute({ page: 1, limit: 10 });

    // Assert
    expect(result).toEqual({
      threads: mockRawQuery.threads,
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPage: 1,
      },
    });
    expect(mockThreadRepository.listThreads).toHaveBeenCalledWith(10, 0);
  });

  it('should list threads on page 2 with correct offset', async () => {
    // Arrange
    mockThreadRepository = new ThreadRepository();
    mockThreadRepository.listThreads = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockRawQuery));

    listThreadsUseCase = new ListThreadsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await listThreadsUseCase.execute({ page: 2, limit: 10 });

    // Assert
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.totalPage).toBe(1);
    expect(mockThreadRepository.listThreads).toHaveBeenCalledWith(10, 10);
  });

  it('should clamp limit to maximum 50', async () => {
    // Arrange
    mockThreadRepository = new ThreadRepository();
    mockThreadRepository.listThreads = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockRawQuery));

    listThreadsUseCase = new ListThreadsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await listThreadsUseCase.execute({ page: 1, limit: 100 });

    // Assert
    expect(result.pagination.limit).toBe(50);
    expect(mockThreadRepository.listThreads).toHaveBeenCalledWith(50, 0);
  });

  it('should use default page and limit when both are less than 1', async () => {
    // Arrange
    mockThreadRepository = new ThreadRepository();
    mockThreadRepository.listThreads = vi
      .fn()
      .mockImplementation(() => Promise.resolve({ threads: [], total: 0 }));

    listThreadsUseCase = new ListThreadsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await listThreadsUseCase.execute({ page: 0, limit: 0 });

    // Assert
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
    expect(mockThreadRepository.listThreads).toHaveBeenCalledWith(10, 0);
  });

  it('should use default page and limit when both are not valid number', async () => {
    // Arrange
    mockThreadRepository = new ThreadRepository();
    mockThreadRepository.listThreads = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockRawQuery));

    listThreadsUseCase = new ListThreadsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await listThreadsUseCase.execute({ page: 'xyz', limit: 'abc' });

    // Assert
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
    expect(mockThreadRepository.listThreads).toHaveBeenCalledWith(10, 0);
  });

  it('should calculate totalPage correctly when total is not divisible by limit', async () => {
    // Arrange
    mockThreadRepository = new ThreadRepository();
    mockThreadRepository.listThreads = vi
      .fn()
      .mockImplementation(() => Promise.resolve({ threads: [], total: 23 }));

    listThreadsUseCase = new ListThreadsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await listThreadsUseCase.execute({ page: 1, limit: 10 });

    // Assert
    expect(result.pagination.totalPage).toBe(3);
  });

});
