import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import {
  TextField,
  Box,
  Alert,
  IconButton,
  Collapse,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'

type DataProps = {
  code: string
  discount_type: string
  amount: string
  individual_use: boolean
  exclude_sale_items: boolean
  date_expires: string
}

type FormProps = {
  data: DataProps
  email: string
}

function Popup() {
  const [showModal, setModalStatus] = useState(false)
  const [status, setStatus] = useState<'success' | 'error'>('success')
  const [message, setMessage] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState({
    email: false,
  })

  //check if form is valid
  const checkForm = ({ email }: { email: string }) => {
    if (!email.includes('@') || email == '' || email.length < 4) {
      setErrors({ email: true })
      return false
    } else {
      setErrors({ email: false })
      return true
    }
  }

  const onClose = () => {
    setModalStatus(false)
  }

  const onClosePopUp = async ({ data, email }: FormProps) => {
    let isValidForm = checkForm({
      email,
    })

    if (isValidForm) {
      try {
        const response = await axios.post(
          // 'https://popups-server.onrender.com/generate',
          'http://localhost:3030/generate',
          { email },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        )
        console.log(response)

        setModalStatus(false)
        setOpen(true)
      } catch (error) {
        setStatus('error')
        setModalStatus(false)
        setOpen(true)
        console.error(error)
        setMessage('Error creating coupon')
      }
    }
  }

  useEffect(() => {
    const homePageCrumb = 'Home Healthcare & Medical Supplies'
    const crumbs = document.querySelector('div#crumbs')
    const secondCrumb = crumbs?.children[1].children[0]
    // if (secondCrumb?.children[0]?.textContent?.includes(homePageCrumb)) {
    setTimeout(() => {
      setModalStatus(true)
    }, 5000)
    // }
  }, [])

  return (
    <>
      {showModal && (
        <PopupContainer>
          <HomePagePopup>
            <HomePagePopupContent>
              <LeftSideContent>
                <ImgContainer>
                  <img
                    src="https://starkmedicalsupplies.com/wp-content/uploads/2024/05/Untitled-1.png"
                    alt="starkmedicalsupplies"
                  />
                </ImgContainer>
              </LeftSideContent>
              <RightSideContent>
                <PopupHeader className="popup-header">
                  <Button id="close-button" onClick={onClose}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="14"
                      width="10.5"
                      viewBox="0 0 384 512"
                    >
                      <path
                        fill="#000000"
                        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                      />
                    </svg>
                  </Button>
                </PopupHeader>
                <ContentContainer className="wp-content">
                  <PopupHeadline style={{ fontSize: '2rem' }}>
                    Shop online and save!
                  </PopupHeadline>
                  <PopupHeadline
                    style={{ fontSize: '1.3rem', marginTop: '-8px' }}
                  >
                    GET 15% OFF YOUR NEXT PURCHASE
                  </PopupHeadline>
                  <Typography
                    style={{
                      marginTop: '1rem',
                      textAlign: 'center',
                      padding: '0px 2rem',
                    }}
                  >
                    Fill in the form below to enjoy a 15% discount on your next
                    purchase.
                  </Typography>
                  <EmailForm onClosePopUp={onClosePopUp} errors={errors} />
                  <BottomCallToAction>
                    This exclusive offer is just a click away!
                  </BottomCallToAction>
                </ContentContainer>
              </RightSideContent>
            </HomePagePopupContent>
          </HomePagePopup>
        </PopupContainer>
      )}
      <TransitionAlerts
        open={open}
        setOpen={setOpen}
        status={status ?? 'success'}
        message={message}
      />
    </>
  )
}

const EmailForm = ({
  onClosePopUp,
  errors,
}: {
  onClosePopUp: ({ data, email }: FormProps) => void
  errors: { email: boolean }
}) => {
  const [email, setEmail] = useState('')
  const date = new Date()

  const createCoupon = async () => {
    const generateRandomCode = (length: number) => {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        )
      }
      return result
    }

    const data = {
      code: generateRandomCode(8),
      discount_type: 'percent',
      amount: '15',
      individual_use: true,
      exclude_sale_items: true,
      date_expires: new Date(date.setMonth(date.getMonth() + 1))
        .toISOString()
        .split('T')[0],
    }
    onClosePopUp({ data, email })
  }

  const onSubmit = (e: any) => {
    createCoupon()
  }

  return (
    <FormContainer>
      <FormBlock>
        <InputContainer>
          <StyledInputText
            required
            error={errors.email}
            placeholder="Enter your email"
            id="email"
            name="email"
            size="small"
            autoFocus
            fullWidth
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        </InputContainer>
        <ButtonContainer>
          <Submit id="button" onClick={onSubmit}>
            Submit
          </Submit>
        </ButtonContainer>
      </FormBlock>
    </FormContainer>
  )
}

//bottom alert
const TransitionAlerts = ({
  open,
  setOpen,
  status,
  message,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  status: 'success' | 'error'
  message?: string
}) => {
  return (
    <Notification>
      <Collapse in={open}>
        <Alert
          severity={status ?? 'success'}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false)
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </Notification>
  )
}

const Button = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  transition: 0.5s all ease-in-out;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.075);
  }
`

const PopupHeader = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0.5rem;
  position: absolute;
  top: 0px;
  right: 0px;
`

export const HomePagePopupContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden !important;
  border-radius: 8px;
  background: url('https://i.postimg.cc/PrpTcjTy/cross.png');
`

export const LeftSideContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  width: 70%;
  height: 100%;
  overflow: hidden;

  & img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`

export const RightSideContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 1rem;
`

const PopupHeadline = styled(Typography)`
  text-transform: uppercase;
  color: #000062;
  text-align: center;
  font-weight: 600 !important;
`

const ButtonContainer = styled.div`
  width: 20%;
  height: 50px !important;
  display: flex;
  justify-content: center;
  align-items: center;
`
const FormContainer = styled.div`
  margin-top: 1rem;
  gap: 1rem;
  width: 100%;
`

const StyledInputText = styled(TextField)`
  width: 100%;
  font-size: 1.2rem;
  background-color: #fff;
`
const Submit = styled(Button)`
  background-color: #000062;
  border-radius: 2px;
  color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 80%;
  height: 20px;

  padding: 10px;
  font-size: 16px;
  font-family: inherit;

  transition: 0.5s all ease-in-out;

  &:hover {
    cursor: pointer !important;
    background-color: #395ea3 !important;
  }
`

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  gap: 0.25rem;
  width: 100%;
  flex-direction: column;
`

const FormBlock = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
`

export const PopupContainer = styled.div`
  background-color: hsla(0, 0%, 0%, 0.277);
  min-width: 100vw;
  min-height: 100vh;
  z-index: 10000;
  position: fixed;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 1s ease-in-out;
`

const PopupElement = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 0px 163px -26px rgba(0, 0, 0, 0.75);
  border-radius: 10px;
  position: relative;
`
const HomePagePopup = styled(PopupElement)`
  width: 50%;
  height: 40%;
`
const BottomCallToAction = styled(Typography)`
  text-transform: uppercase;
  margin-top: 1.5rem !important;
`
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  width: 100%;
  height: 100%;
`

const Notification = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 7%;
  z-index: 100000;
`

const TextOverBlock = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  padding: 1.5rem;
`

const TextBlockContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;

  height: 100%;
  width: 100%;
`
const ImgContainer = styled.div`
  margin: -10px;
`

export default Popup
