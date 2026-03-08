export const transaction = jest.fn().mockResolvedValue({
  commit: jest.fn(),
  rollback: jest.fn(),
});
export const authenticate = jest.fn();
export const close = jest.fn();
export const define = jest.fn();
export const models = {};

const mockSequelize = {
  transaction,
  authenticate,
  close,
  define,
  models,
};

export default mockSequelize;
