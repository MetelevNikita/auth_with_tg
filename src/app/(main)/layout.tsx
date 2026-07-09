
import { Container } from 'react-bootstrap'

export default function MainLayout ({ children }: { children: React.ReactNode }) {
  
  return (
    <Container>
      <h1>Main Layout</h1>
      {children}
    </Container>
  )

}