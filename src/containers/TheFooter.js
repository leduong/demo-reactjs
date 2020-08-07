import React from 'react'
import { CFooter, CLink } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <CLink href="https://uiza.io/" className="text-secondary" target="_blank">
          © 2020 Compnay PTE. LTD
        </CLink>
      </div>
      <div className="ml-auto">
        <span className="mr-1">@leduongcom</span>
      </div>
    </CFooter>
  );
}

export default React.memo(TheFooter)
