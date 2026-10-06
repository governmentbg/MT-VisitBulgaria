const _t = atob('aWRkcWQ=')

/** Admin tools route path (relative to /admin) */
export const TOOLKIT_ROUTE = `/${_t}` as `/${string}`

/** Full admin route path including /admin prefix */
export const TOOLKIT_ADMIN_PATH = `/admin/${_t}`

/** The keyboard sequence that triggers navigation to admin tools */
export const TOOLKIT_TRIGGER = _t
