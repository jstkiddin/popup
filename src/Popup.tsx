import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { InputMask } from 'primereact/inputmask'
import styled from 'styled-components'
import { TextField, Box, Alert, IconButton, Collapse } from '@mui/material'
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

const consumerKey = 'ck_7647dd7a6fd549441b74816c0da8de6466a57e10'
const consumerSecret = 'cs_6e181e59d08bd7e85a00417864e4ea8931c3a5bb'
const storeUrl = 'https://starkmedicalsupplies.com' // Replace with your store URL

function Popup() {
  const [showModal, setModalStatus] = useState(false)
  const [status, setStatus] = useState<'success' | 'error'>('success')
  const [message, setMessage] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState({
    email: false,
  })

  console.log(errors.email)

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
    console.log(email, isValidForm)

    if (isValidForm) {
      try {
        const response = await axios.post(
          `${storeUrl}/wp-json/wc/v3/coupons`,
          data,
          {
            auth: {
              username: consumerKey,
              password: consumerSecret,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (response.data.id) {
          setStatus('success')
          setMessage('Your request was succsessfuly sent.')
        } else {
          setMessage('Failed to create coupon')
        }
        setModalStatus(false)
        setOpen(true)
      } catch (error) {
        setStatus('error')
        setModalStatus(false)
        setOpen(true)
        console.error(error)
        setMessage('Error creating coupon')
      }

      // await axios
      //   .post(
      //     url,
      //     {
      //       names: name,
      //       lastNames: lastName,
      //       email: email,
      //       phone: phone,
      //       comments: comment,
      //       createdDate: new Date(),
      //       remoteIp: '',
      //       country: '',
      //     },
      //     {
      //       headers: {
      //         'Content-Type': 'application/json',
      //         Accept: 'application/json',
      //       },
      //     }
      //   )
      //   .then(function (response) {
      //     if (response.status === 200) {

      //     } else {
      //       setStatus('error')
      //       setMessage('Something went wrong.')
      //     }
      //     setModalStatus(false)
      //     setOpen(true)
      //     console.log(response)
      //     console.log('click')
      //   })
      //   .catch(function (error) {
      //     setStatus('error')
      //     setMessage('Something went wrong.')
      //     setModalStatus(false)
      //     setOpen(true)
      //     console.log(error)
      //   })
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
              <LeftSideCocntent>
                <img src="public/Untitled-1.png" alt="starkmedicalsupplies" />
              </LeftSideCocntent>
              <RightSideCocntent>
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
                  <PopupHeadline>Get your 15% discount</PopupHeadline>
                  <span>
                    Fill in the form to get a discount code for our products.
                  </span>
                  <CreateCoupon onClosePopUp={onClosePopUp} errors={errors} />
                </ContentContainer>
              </RightSideCocntent>
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

const CreateCoupon = ({
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
      amount: '10',
      individual_use: true,
      exclude_sale_items: true,
      date_expires: new Date(date.setMonth(date.getMonth() + 1))
        .toISOString()
        .split('T')[0],
    }
    console.log(email)
    onClosePopUp({ data, email })
  }

  const onSubmit = (e: any) => {
    createCoupon()
  }

  return (
    <FormContainer>
      <FormBlock>
        <InputContainer>
          <label>Email: </label>
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
`

export const LeftSideCocntent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50%;
  height: 100%;
  & img {
    height: 100%;
    width: 100%;
    margin-left: 1rem;
    object-fit: contain;
  }
`

export const RightSideCocntent = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 3rem;
`

const PopupHeadline = styled.h2`
  text-transform: uppercase;
  color: #000062;
  text-align: center;
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const FormContainer = styled.div`
  margin-top: 1rem;
  gap: 1rem;
  & form {
  }
`

const StyledInputText = styled(TextField)`
  width: 80%;
  font-size: 1.2rem;
`
const Submit = styled(Button)`
  background-color: #000062;
  border-radius: 2px;
  color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 80%;

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

  flex-direction: column;
`

const FormBlock = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  gap: 0.5rem;
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

const ContentContainer = styled.div``

const Notification = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 7%;
  z-index: 100000;
`

export default Popup
