import React from 'react'
import { CNavItem } from '@coreui/react'
import {
  FaRegAddressCard,
} from "react-icons/fa";

const _nav = {
  admin_nav: [
    {
      component: CNavItem,
      name: 'Staff',
      to: '/staff',
      icon: <FaRegAddressCard className="nav-icon" title="Staff" />,
    },
  ],
}

export default _nav
