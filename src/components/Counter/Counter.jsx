import React from "react";
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.resendOTP = this.resendOTP.bind(this);

    this.state = {
      start: Date.now(),
      diff: 0,
      minutes: 0,
      seconds: 0,
      duration: 60 * this.props.minutes,
      resend: false,
    };
    this.timerState = "";
    this.timerCount = "";
    this.count = 0;
  }
  /******************* 
  @Purpose : Used for bind data after intial rander
  @Parameter : {}
  @Author : INIC
  ******************/
  componentDidMount() {
    window.clearInterval(this.timerCount);
    this.timerCount = setInterval(() => {
      this.timer();
    }, 1000);
  }
  /******************* 
  @Purpose : Used for start timer
  @Parameter : {}
  @Author : INIC
  ******************/
  startTimer = () => {
    window.clearInterval(this.timerCount);
    this.timerCount = setInterval(() => {
      this.timer();
    }, 1000);
  };
  /******************* 
  @Purpose : Used for perform action before leave the page
  @Parameter : {}
  @Author : INIC
  ******************/
  componentWillUnmount() {
    window.clearInterval(this.timerCount);
  }
  /******************* 
  @Purpose : Used for timer functionality
  @Parameter : {}
  @Author : INIC
  ******************/
  timer() {
    let { duration, start } = this.state;
    let diff = duration - (((Date.now() - start) / 1000) | 0);
    let minutes = (diff / 60) | 0;
    let seconds = diff % 60 | 0;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    this.setState({ minutes: minutes, seconds: seconds });

    if (diff <= 0) {
      this.setState({ resend: true });
      window.clearInterval(this.timerCount);
    }
  }
  /******************* 
  @Purpose : Used for resend OTP
  @Parameter : evt
  @Author : INIC
  ******************/
  resendOTP(evt) {
    this.setState({
      start: Date.now(),
      minutes: 0,
      seconds: 0,
      duration: 60 * this.props.minutes,
    });
    this.props.resendEvent();
    this.startTimer();
    evt.preventDefault();
  }
  /******************* 
  @Purpose : Used for rander html into react components
  @Parameter : evt
  @Author : INIC
  ******************/
  render() {
    let { minutes, seconds } = this.state;
    return (
      <div>
        <h3 className="errMsg" style={this.props.style.otpTimer}>
          {minutes} : {seconds}
        </h3>
        <button
          className="resend"
          style={this.props.style.resendBtn}
          onClick={this.resendOTP}
        >
          Resend
        </button>
      </div>
    );
  }
}

export default Counter;
