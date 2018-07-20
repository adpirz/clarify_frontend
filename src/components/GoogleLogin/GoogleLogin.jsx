import React from 'react';
import { DataConsumer } from './DataProvider';


class GoogleLogin extends React.Component {
    constructor(props) {
        super(props)
        this.signIn = this.signIn.bind(this)
        this.enableButton = this.enableButton.bind(this)
        this.state = {
          disabled: true
        }
      }
      componentDidMount() {
        const { clientId } = this.props;
        ((document, script, id, callback) => {
          const element = d.getElementsByTagName(s)[0]
          const fjs = element
          let js = element
          js = d.createElement(s)
          js.id = id
          js.src = jsSrc
          if (fjs && fjs.parentNode) {
            fjs.parentNode.insertBefore(js, fjs)
          } else {
            d.head.appendChild(js)
          }
          js.onload = callback
        })(document, 'script', 'google-login', () => {
          const params = {
            client_id: clientId,
          }
    
          window.gapi.load('auth2', () => {
            this.enableButton()
            if (!window.gapi.auth2.getAuthInstance()) {
              window.gapi.auth2.init(params).then(
                res => {
                  if (isSignedIn && res.isSignedIn.get()) {
                    this.handleSigninSuccess(res.currentUser.get())
                  }
                },
                err => onFailure(err)
              )
            }
            if (autoLoad) {
              this.signIn()
            }
          })
        })
      }
      componentWillUnmount() {
        this.enableButton = () => {}
      }
      enableButton() {
        this.setState({
          disabled: false
        })
      }
      signIn(e) {
        if (e) {
          e.preventDefault() // to prevent submit if used within form
        }
        if (!this.state.disabled) {
          const auth2 = window.gapi.auth2.getAuthInstance()
          const { onSuccess, onRequest, onFailure, prompt, responseType } = this.props
          const options = {
            prompt
          }
          onRequest()
          if (responseType === 'code') {
            auth2.grantOfflineAccess(options).then(res => onSuccess(res), err => onFailure(err))
          } else {
            auth2.signIn(options).then(res => this.handleSigninSuccess(res), err => onFailure(err))
          }
        }
      }
      handleSigninSuccess(res) {
        /*
          offer renamed response keys to names that match use
        */
        const basicProfile = res.getBasicProfile()
        const authResponse = res.getAuthResponse()
        res.googleId = basicProfile.getId()
        res.tokenObj = authResponse
        res.tokenId = authResponse.id_token
        res.accessToken = authResponse.access_token
        res.profileObj = {
          googleId: basicProfile.getId(),
          imageUrl: basicProfile.getImageUrl(),
          email: basicProfile.getEmail(),
          name: basicProfile.getName(),
          givenName: basicProfile.getGivenName(),
          familyName: basicProfile.getFamilyName()
        }
        this.props.onSuccess(res)
      }
    
      render() {
        const { tag, type, style, className, disabledStyle, buttonText, children, render } = this.props
        const disabled = this.state.disabled || this.props.disabled
    
        if (render) {
          return render({ onClick: this.signIn })
        }
    
        const initialStyle = {
          display: 'inline-block',
          background: '#d14836',
          color: '#fff',
          width: 190,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 2,
          border: '1px solid transparent',
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: 'Roboto'
        }
        const styleProp = (() => {
          if (style) {
            return style
          } else if (className && !style) {
            return {}
          }
    
          return initialStyle
        })()
        const defaultStyle = (() => {
          if (disabled) {
            return Object.assign({}, styleProp, disabledStyle)
          }
    
          return styleProp
        })()
        const googleLoginButton = React.createElement(
          tag,
          {
            onClick: this.signIn,
            style: defaultStyle,
            type,
            disabled,
            className
          },
          children || buttonText
        )
    
        return googleLoginButton
      }
    }
}

export default GoogleLogin