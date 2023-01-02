import { element } from 'prop-types'
import React from 'react'

// ========= admin ============
const Staff = React.lazy(()=>import('./views/admin/staff/Staff'))

const routes = [

  // ============ admin ==============
  { path : '/staff', name: 'Staff', element:Staff},
]

export default routes
