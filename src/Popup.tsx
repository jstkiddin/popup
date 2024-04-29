import { useEffect, useState, useRef, MutableRefObject } from 'react'
import { InputMask } from 'primereact/inputmask'
// import { InputText } from 'primereact/inputtext'
// import InputMask from 'react-input-mask'
import styled from 'styled-components'
import { TextField } from '@mui/material'
import axios from 'axios'

function Popup() {
  const [showModal, setModalStatus] = useState(false)

  const onClosePopUp = () => {
    setModalStatus(false)

    // popup.attributeStyleMap.set('opacity', '0')
    // setTimeout(() => {
    // popup.attributeStyleMap.set('display', 'none')
    // }, 2000)
  }

  useEffect(() => {
    const homePageCrumb = 'Home Healthcare & Medical Supplies'
    const crumbs = document.querySelector('div#crumbs')
    const secondCrumb = crumbs?.children[1].children[0]

    if (secondCrumb?.children[0]?.textContent?.includes(homePageCrumb)) {
      setTimeout(() => {
        setModalStatus(true)
      }, 5000)
      // const container = PopupContainer
      // container.attributeStyleMap.set("opacity", "1");
    }
  }, [])

  if (!showModal) {
    return <div></div>
  }

  return (
    <PopupContainer>
      <HomePagePopup>
        <HomePagePopupContent>
          <LeftSideCocntent>
            <img
              src="https://lh4.googleusercontent.com/x3PRkuZ7hjLqtMFny-WRD5gUtiXGjEBZaI9UgVcTbmiB6-YGT8VIh8hniLHDwpx965sB3mUTfPMbdYqSrqIkMKbR1Yl1JP5Rcc5LU8kV_eKcqGP4sqBVJwkGKl9TZ4i2pg=w200"
              alt="starkmedicalsupplies"
            />
          </LeftSideCocntent>
          <RightSideCocntent>
            <PopupHeader className="popup-header">
              <Button id="close-button" onClick={onClosePopUp}>
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

              <PopupForm onClosePopUp={onClosePopUp} />
            </ContentContainer>
          </RightSideCocntent>
        </HomePagePopupContent>
      </HomePagePopup>
    </PopupContainer>
  )
}

const PopupForm = ({ onClosePopUp }: { onClosePopUp: () => void }) => {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')

  const url = 'https://sanketing-api.etrans.solutions/Request'

  const closeModal = async () => {
    await axios
      .post(
        url,
        {
          names: name,
          lastNames: lastName,
          email: email,
          phone: phone,
          comments: comment,
          createdDate: new Date(),
          remoteIp: '',
          country: '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )
      .then(function (response) {
        console.log(response)
        onClosePopUp()
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const onSubmit = (e: any) => {
    closeModal()
  }

  return (
    <FormContainer>
      <form action="" className="form" id="form">
        <FormBlock>
          <InputContainer>
            <label>First Name: </label>
            <StyledInputText
              placeholder="Your first name"
              id="name"
              name="name"
              fullWidth
              size="small"
              autoFocus
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
          </InputContainer>

          <InputContainer>
            <label>Last Name: </label>
            <StyledInputText
              placeholder="Your last name"
              id="lastName"
              name="lastName"
              size="small"
              fullWidth
              autoFocus
              value={lastName}
              onChange={(e: any) => setLastName(e.target.value)}
            />
          </InputContainer>

          <InputContainer>
            <label>Email: </label>
            <StyledInputText
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

          <InputContainer>
            <label>Phone number: </label>
            {/* <InputMask mask="+9(999)999-9999">
              {() => (
                <TextField
                  // ref="phone"
                  name="phone"
                  type="text"
                  size="small"
                  fullWidth
                  value={phone}
                  onChange={(e: any) => setPhone(e.target.value ?? '')}
                />
              )}
            </InputMask> */}
            <TextField
              name="phone"
              type="text"
              size="small"
              fullWidth
              value={phone}
              onChange={(e: any) => setPhone(e.target.value ?? '')}
            >
              <InputMask mask="+9(999)999-9999" />
            </TextField>
          </InputContainer>

          <InputContainer>
            <label>Comment: </label>

            <StyledInputText
              placeholder="Leave a comment"
              id="comment"
              name="comment"
              size="small"
              multiline
              fullWidth
              rows={4}
              value={comment}
              onChange={(e: any) => setComment(e.target.value)}
            />
          </InputContainer>

          <ButtonContainer>
            <Submit id="button" onClick={onSubmit}>
              Submit
            </Submit>
          </ButtonContainer>
        </FormBlock>
      </form>
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
const StyledInputMask = styled(InputMask)`
  width: 80%;
  font-size: 1.2rem;
`
const Submit = styled(Button)`
  background-color: #000062;
  border-radius: 2px;
  color: #fff;
  display: block;
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
  // opacity: 0;
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

export default Popup
