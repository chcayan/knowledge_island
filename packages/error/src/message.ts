import { ERROR_CODE } from './code'

export const ERROR_MESSAGE = {
  // 400
  [ERROR_CODE.BAD_REQUEST]: '参数校验失败',

  // 401
  [ERROR_CODE.TOKEN_EXPIRED]: '登录状态过期',
  [ERROR_CODE.NO_TOKEN]: '没有 token',
  [ERROR_CODE.UNAUTHORIZED]: '身份校验失败',
  [ERROR_CODE.TOKEN_MISMATCH]: 'token 校验失败',
  [ERROR_CODE.USER_IDENTITY_VERIFICATION_FAILED]: '用户名或密码错误',

  // 403
  [ERROR_CODE.FORBIDDEN]: '没有权限访问',
  [ERROR_CODE.TEMPORARY_FORBIDDEN]: '该用户权限暂时被禁用',
  [ERROR_CODE.USER_LOGIN_FORBIDDEN]: '该用户暂时禁止登录',
  [ERROR_CODE.USER_POST_FORBIDDEN]: '该用户暂时禁止发布帖子',
  [ERROR_CODE.USER_COMMENT_FORBIDDEN]: '该用户暂时禁止发布评论',

  // 404
  [ERROR_CODE.USER_NOT_FOUND]: '未找到该用户',

  // 409
  [ERROR_CODE.EMAIL_HAS_BEEN_REGISTERED]: '邮箱已被注册',
}
