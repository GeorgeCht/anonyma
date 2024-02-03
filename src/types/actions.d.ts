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

type Members = {
  count: number
}
