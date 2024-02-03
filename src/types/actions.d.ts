// eslint-disable-next-line no-unused-vars
type ActionResponseState =
  | {
      status: 'success'
      message: string
    }
  | {
      status: 'error'
      message: string
      errors?: Array<{
        path: string
        message: string
      }>
    }
  | null

// eslint-disable-next-line no-unused-vars
type DataResponseState<T> =
  | {
      status: 'success'
      response: T
    }
  | {
      status: 'error'
      message: string
    }
  | null

// eslint-disable-next-line no-unused-vars
type Members = {
  count: number
}
