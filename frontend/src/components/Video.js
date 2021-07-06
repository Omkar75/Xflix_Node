import React from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header.js";
import VideoPreview from "./VideoPreview.js";
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai'
import { Button } from "antd";
import Iframe from 'react-iframe';
import { config } from "../App";
import Grid from "@material-ui/core/Grid";
import Container from '@material-ui/core/Container';
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
      <div key={data._id}>
        <VideoPreview data={data}/>
      </div>
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
          <Container fixed>
          <div class="iframe-container">
          <Iframe url={`https://www.${this.props.location.state.data.videoLink}`} width="100%" frameborder="0" title="Responsive iframe example" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen  /> 
          </div>
            

            
            <div className="jack">
            <h2 className="title">
                {this.props.location.state.data.title}
            </h2>
            <span className="rating-date">{this.props.location.state.data.contentRating} <img src="dot.svg" alt=""/> {this.props.location.state.date}</span>
            </div>
            <div className="monster">
            <div className="button">
            {this.state.likeon ? (<Button id="upvote" onClick={this.like.bind(this,"decrease")}><AiOutlineLike /> {this.videoData.votes.upVotes}</Button>
            ):<Button id="upvote" onClick={this.like.bind(this,"increase")}><AiOutlineLike />{this.videoData.votes.upVotes}</Button>}
            {this.state.unlikeon ? ( <Button id="downvote" onClick={this.unlike.bind(this,"decrease")}><AiOutlineDislike /> {this.videoData.votes.downVotes}</Button>
            ):<Button id="downvote" onClick={this.unlike.bind(this,"increase")}><AiOutlineDislike /> {this.videoData.votes.downVotes}</Button>}
            </div>
            </div>
            <div className="Line"></div>
            </Container>
          </>
          
          ) : <div className="loading-text">Loading video...</div>}
          <Container fixed>
                    <div>
                    <Grid container spacing={3}>
                    {this.state.allVideos.length !== 0 ? (
                    this.state.filteredVideos.map((data,key)  => <Grid item xs={6} sm={6} md={4}>{this.getVideos(data)}</Grid>)
                  ) : !this.state.loading ? (
                    <div className="loading-text">Loading videos...</div>
                  ) : (
                    <div className="loading-text">No videos to load</div>
                  )}
                    </Grid>
                    </div>
                </Container>

      </div>
    );
  }

}

export default withRouter(Video);
