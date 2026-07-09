import { Container  } from 'react-bootstrap'
import Image from 'next/image'

// 

import logoUfanet from '@/../public/logo_ufanet/logo_full.26387419.svg'


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className='vw-100 vh-100 d-flex flex-column justify-content-center align-items-center'>
      <Image src={logoUfanet} width={200} height={200} alt='logo'/>
      {children}
    </Container>
  )
}