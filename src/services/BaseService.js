class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll(options) {
    return await this.repository.findAll(options);
  }

  async getById(id) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error("Item not found");
    }
    return item;
  }

  async create(data) {
    return await this.repository.create(data);
  }

  async update(id, data) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error("Item not found");
    }
    return await this.repository.update(id, data);
  }

  async delete(id) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error("Item not found");
    }
    return await this.repository.delete(id);
  }
}

export default BaseService;
