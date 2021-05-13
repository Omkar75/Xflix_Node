import React from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header.js";
import VideoPreview from "./VideoPreview.js";
import { Button, Row, Col } from "antd";
import Iframe from 'react-iframe';
import { config } from "../App";
import "./Video.css";

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allVideos: [],
      loading: false,
      likeon:true,
      unlikeon:false,
      filteredVideos: [],
      
      // videoData : []
    };
    this.videoData = [];
  }
  getVideos = (data) => {
    return (
      <Col key={data._id}>
        <VideoPreview data={data}/>
      </Col>
    );
  };
  getVideoByID = async() =>{
    let id = this.props.match.params.videoId
    // console.log(id)
    const resp = await fetch(config.endpoint + `/videos/${id}`)
    .then((res) => res.json())
    .catch((error) => console.log(error));  
    if(resp){
    // this.setState({
    //   videoData: resp
    // });
    this.videoData = resp
    // console.log(this.videoData)
  }
}

  patchView = async() =>{
    await fetch(config.endpoint + "/videos/"+this.props.match.params.videoId+"/views", {
      method:'PATCH',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })
    .then((res) => res)
    .catch((error) => console.log(error));
  }

  performApiCall= async()=>{
    debugger
    
  let response = await fetch(
    `${config.endpoint}/videos`
  );
  if (!response.ok) {
    return;
  }
  response = await response.json();

  this.setState({allVideos: response.videos,
  filteredVideos: response.videos})
     console.log("getdata :", this.state.allVideos);
     
  }

  componentDidMount = async() => {
    // this.setState({
      this.videoData = this.props.location.state.data;
    // })
    await this.getVideoByID();
    await this.performApiCall(); 
    await this.patchView();   
  }

  like = async(val) => {
    let id = this.props.match.params.videoId
    const resp = await fetch(config.endpoint + "/videos/"+id+"/votes", {
      method:'PATCH',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
          "vote": "upVote",
          "change": val 
      })
    })
    .then((res) => res)
    .catch((error) => console.log(error)); 
    if(resp.ok){
      
      if(val === "decrease"){
        this.setState({
          likeon:false
        })
      }else{
        this.setState({
          likeon:true
        })
      }
       this.getVideoByID();
    }
  }

  unlike = async(val) => {
    // console.log(val)
    let id = this.props.match.params.videoId
    const resp = await fetch(config.endpoint + "/videos/"+id+"/votes", {
      method:'PATCH',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        "vote": "downVote",
        "change": val 
      })
    })
    .then((res) => res)
    .catch((error) => console.log(error));
    if(resp.ok){
      
      if(val === "decrease"){
        this.setState({
          unlikeon:false
        })
      }else{
        this.setState({
          unlikeon:true
        })
      }
      this.getVideoByID();
      // this.patchView();
    }
    // console.log(resp) 
  }

  render() {
    return (
      <div className="fullpage">
          <Header history={this.props.history} />
          {this.videoData.length !== 0 ? (
            <>
          <div className="main">
          <div className="iframe-parent">
          <Iframe url={`https://www.${this.props.location.state.data.videoLink}`} width="100%" height="100%" allow="fullscreen" className="iframe" /> 
          </div> 
          </div>
          <div className="jack">
          <h2 className="title">
              {this.props.location.state.data.title}
          </h2>
          <span className="rating-date">{this.props.location.state.data.contentRating} <img src="dot.svg" alt=""/> {this.props.location.state.date}</span>
          </div>
          <div className="monster">
          <div className="button">
          {this.state.likeon ? (<Button id="upvote" onClick={this.like.bind(this,"decrease")}><img src="updark.svg" alt="" />{this.videoData.votes.upVotes}</Button>
          ):<Button id="upvote" onClick={this.like.bind(this,"increase")}><img src="updark.svg" alt="" />{this.videoData.votes.upVotes}</Button>}
          {this.state.unlikeon ? ( <Button id="downvote" onClick={this.unlike.bind(this,"decrease")}><img src="downdark.svg" alt=""/>{this.videoData.votes.downVotes}</Button>
          ):<Button id="downvote" onClick={this.unlike.bind(this,"increase")}><img src="downdark.svg" alt=""/>{this.videoData.votes.downVotes}</Button>}
          </div>
          </div>
          <div className="Line"></div></>
          ) : <div className="loading-text">Loading video...</div>}
          <Row>
          <Col>
            <div className="container "> 
            <Row className="second-row" gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }} justify={"center"}>
              {this.state.allVideos.length !== 0 ? (
                this.state.filteredVideos.map((data,key)  => <Col xs={24} sm={12} md={8} xl={8}>
                <div>{this.getVideos(data)}</div>
            </Col>)
              ) : !this.state.loading ? (
                <div className="loading-text">Loading videos...</div>
              ) : (
                <div className="loading-text">No videos to load</div>
              )}
            </Row>
            </div> 
          </Col>
        </Row>

      </div>
    );
  }

}

export default withRouter(Video);
