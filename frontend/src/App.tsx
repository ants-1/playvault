import { Button, VStack } from "@chakra-ui/react"
import { Link } from "react-router-dom"

function App() {
  return (
    <>
      <VStack>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
        <Link to="/sign-up">
          <Button>Sign Up</Button>
        </Link>
      </VStack>
    </>
  )
}

export default App
