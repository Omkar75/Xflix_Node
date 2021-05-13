import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import  VideoPreview  from './VideoPreview';
import { Row, Col, Button, Input, Form, Select, DatePicker, Modal } from 'antd';
import 'antd/dist/antd.css';
import "./LandingPage.css"
import moment from "moment";
import { config } from "../App";
import Grid from "@material-ui/core/Grid";
import Icon from "@mdi/react";
import { mdiSwapVertical } from "@mdi/js";
import Header from "./Header.js";
import { HiUpload } from "react-icons/hi";
class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            filteredVideos: [],
            searchText: '',
            sortBy: "releaseDate",
            videoList: [],
            allVideoList: [],
            selectedGenres: ["all"],
            allGenres: [
                { label: "All", value: "all" },
                { label: "Education", value: "Education" },
                { label: "Sports", value: "Sports" },
                { label: "Comedy", value: "Comedy" },
                { label: "Lifestyle", value: "Lifestyle" },
            ],
            allContentRatings: [
                { label: "Anyone", value: "Anyone" },
                { label: "7+", value: "7+" },
                { label: "12+", value: "12+" },
                { label: "16+", value: "16+" },
                { label: "18+", value: "18+" },
            ],
            selectedContentRatings: [],
        }

    }
    showModal = () => {
        this.setState({ visible: true });
    }
    handleOk = async (values) => {
        console.log(values['video-link'])
        console.log(values['thumbnail'])
        console.log(values['age'])
        console.log(values['title'])

        const date = moment(values['date']).format("DD MMM YYYY")
        console.log(date)
        this.setState({
            confirmLoading: true,
        });
        const res = await fetch(config.endpoint + "/videos", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                "videoLink": values['video-link'],
                "title": values['title'],
                "genre": values['genre'],
                "contentRating": values['age'],
                "releaseDate": date.toString(),
                "previewImage": values['thumbnail']
            })
        }).then(() => {
            this.setState({
                visible: false,
                confirmLoading: false
            });
            return res.json()
        })
            .catch(error => console.log(error));
        console.log(res)
    }
    handleCancel = (e) => {
        this.setState({ visible: false })
                
    }
    handleSearchInput = async (event) => {
        let value = event.target.value;
        this.setState({ searchText: value });
        let filteredVideos = await this.state.allVideosList.filter((x) => {
            if (x.title.toLowerCase().includes(value.toLowerCase())) {
                return x
            }
        })
        if (this.state.searchText.length === 0) { filteredVideos = this.state.allVideoList }
        this.setState({ videoList: filteredVideos })
    }
    getFilteredVideosByGenre = (videos, genres) => {
        let filteredVideos = [];
        genres.map((genre) => {
            if (genre === "all") {
                filteredVideos = videos;
                return filteredVideos;
            }
            filteredVideos = [
                ...filteredVideos,
                ...videos.filter((video) => video.genre === genre),
            ];
        });
        return filteredVideos;
    }
    performAPICall = async () => {
        let response;
        let url = `${config.endpoint}/videos`;
        if (this.state.searchText?.length > 0) {
            url += `?title=${this.state.searchText}`;
            url += `&sortBy=${this.state.sortBy}`;
        } else {
            url += `?sortBy=${this.state.sortBy}`;
        }
        response = await fetch(url)
        if (!response.ok) {
            return;
        }
        response = await response.json();
        this.setState({ allVideoList: response.videos })

        let filteredVideos = await this.getFilteredVideosByGenre(response.videos, this.state.selectedGenres);
        this.setState({ videoList: filteredVideos })
        return filteredVideos;
    }
    handleGenreChange = async (genre) => {
        this.setState({ selectedContentRatings: [] })
        let selectedGenres = this.state.selectedGenres;
        let uniqueFilters = new Set(selectedGenres);
        selectedGenres = [...uniqueFilters];
        if (genre.value === "all") {
            if (selectedGenres.includes(genre.value)) {
                selectedGenres = ["all"]
            }
        } else {
            if (this.state.selectedGenres.includes(genre.value)) {
                selectedGenres = selectedGenres.filter((elem) => elem !== "all" && elem !== genre.value)
            } else {
                selectedGenres = selectedGenres.filter((elem) => elem !== "all");
                selectedGenres.push(genre.value);
            }
        }
        uniqueFilters = new Set(selectedGenres);
        selectedGenres = [...uniqueFilters];
        if (selectedGenres.length === 0) {
            selectedGenres.push("all");
        }
        this.setState({ selectedGenres }, async () => {
            let filteredVideos = await this.getFilteredVideosByGenre(
                this.state.allVideoList,
                this.state.selectedGenres
            );
            this.setState({ videoList: filteredVideos })
        })
    }
    handleContentRatingChange = async (contentRating) => {
        this.setState({ selectedGenres: ["all"] })
        let selectedContentRatings = this.state.selectedContentRatings;
        let uniqueFilters = new Set(selectedContentRatings);
        selectedContentRatings = [...uniqueFilters];
        if (this.state.selectedContentRatings.includes(contentRating.value)) {
            selectedContentRatings = selectedContentRatings.filter(
                (elem) => elem !== contentRating.value
            );
        } else {
            selectedContentRatings.push(contentRating.value);
        }


        uniqueFilters = new Set(selectedContentRatings);
        selectedContentRatings = [...uniqueFilters];
        this.setState({ selectedContentRatings }, async () => {
            let filteredVideos = await this.getFilteredVideosByContentRating(
                this.state.allVideoList,
                this.state.selectedContentRatings
            );
            if (selectedContentRatings.length === 0) { filteredVideos = this.state.allVideoList }

            this.setState({ videoList: filteredVideos, })
        });
    }
    getFilteredVideosByContentRating = (videos, contentRatings) => {
        let filteredVideos = [];

        contentRatings.map((contentRating) => {
            if (contentRatings === "anyone") {
                filteredVideos = videos;
                return filteredVideos;
            }
            filteredVideos = [
                ...filteredVideos,
                ...videos.filter((video) => video.contentRating === contentRating),
            ];

            return filteredVideos;
        }
        );
    }
    componentWillMount() {
        this.performAPICall();
    }
    setSortBy = (e) => {
        debugger
        this.setState({ sortBy: e.target.value }, () => {
            this.performAPICall();
            console.log(this.state.sortBy)
        })
    }
    getVideos = (data) => {
        return (
          <Col key={data._id}>
            <VideoPreview data={data}/>
          </Col>
        );
      };
    render() {
        return (
            <div>
                <Header history={this.props.history}
                    search={
                        <Input.Search className="ant-input-search" placeholder="Search" onChange={this.handleSearchInput.bind(this)} enterButton />
                    }
                    upload={
                        <Button type='primary' className="uploadbtnlp" id="upload-btn" onClick={this.showModal.bind(this)}>
                            <HiUpload className="upload-img" /><span className="upload-text">Upload</span>
                        </Button>
                    }
                />
                <Modal title="Upload video" visible={this.state.visible} onCancel={this.handleCancel.bind(this)} footer={null} destroyOnClose = {true}>
                    <Form
                        name="upload-form"
                        method="post"
                        onFinish={this.handleOk.bind(this)}
                        layout="horizontal"
                        size={"large"}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Video link is required!',
                                },
                            ]}
                            name="video-link">
                            <Input placeholder="Video link" />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true, message: `Thumbnail link is required!` }]}
                            name="thumbnail">
                            <Input placeholder="Thumbnail image link" />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true, message: `Title is required!` }]}
                            name="title">
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true, message: `Genre is required!` }]}
                            name="genre">
                            <Select placeholder="Genre">
                                <Select.Option value="Education">Education</Select.Option>
                                <Select.Option value="Sports">Sports</Select.Option>
                                <Select.Option value="Comedy">Comedy</Select.Option>
                                <Select.Option value="Lifestyle">Lifestyle</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true, message: `Age group is required!` }]}
                            name="age">
                            <Select placeholder="Suitable age group for the clip">
                                <Select.Option value="Anyone">Any age group</Select.Option>
                                <Select.Option value="7+">7+</Select.Option>
                                <Select.Option value="12+">12+</Select.Option>
                                <Select.Option value="16+">16+</Select.Option>
                                <Select.Option value="18+">18+</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Upload and Publish date"
                            rules={[{ required: true, message: `Upload and Publish date is required!` }]}
                            name="date">
                            <DatePicker />
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" className="videouploadbtn" id="upload-btn-submit" htmlType="submit" disabled={false} loading={this.state.confirmLoading}>
                                Upload Video
                            </Button>
                            <Button id="upload-btn-cancel" className="uploadcanclebtn" onClick={this.handleCancel.bind(this)}>
                                CANCEL
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Grid container>
                    <div className="tool-bar">
                        {this.state.allGenres.map((genre, idx) => (
                            <div
                                onClick={() => this.handleGenreChange(genre)}
                                className={
                                    this.state.selectedGenres.includes(genre.value) ? "active-toolbar-button genre-btn" : "toolbar-button genre-btn"
                                } id={genre.value}
                            >
                                {genre.label}
                            </div>
                        ))}
                        <div className={"toolbar-button-sort"}>
                            <div>
                                <Icon path={mdiSwapVertical} size={1} color="#999" />{" "}
                            </div>
                            <div style={{ marginRight: "10px" }}>Sort By</div>
                            <select onChange={this.setSortBy} className="sort-select">
                                <option value="releaseDate" id="release-date-option" className="select-option">Upload Date</option>
                                <option value="viewCount" id="view-count-option" className="select-option">View Count</option>
                            </select>
                        </div>
                    </div>
                    <div className="tool-bar" style={{ paddingBottom: "20px" }}>
                        {this.state.allContentRatings.map((contentRating, idx) => (
                            <div
                                onClick={() => this.handleContentRatingChange(contentRating)}
                                className={
                                    this.state.selectedContentRatings.includes(contentRating.value) ? "active-toolbar-button content-rating-btn" : "toolbar-button content-rating-btn"
                                } id={contentRating.value}
                            >
                                {contentRating.label}
                            </div>
                        ))}
                    </div>
                </Grid>
                <div style={{height : "40px", backgroundColor:"black"}}></div>
                <div className='Landpage'>
                <Row gutter={[16,16]}>
                        {this.state.allVideoList.length !== 0 ? (
                            this.state.videoList.map((data,key)=><Col xs={24} sm={12} md={8}>{this.getVideos(data)}</Col>)
                        ):!this.state.loading ? (
                            <div className="loading-text">Loading videos...</div>
                        ) : (
                                    <div className="loading-text">No videos</div>
                                )}
                    </Row>
                </div>
            </div>
        );
    }
}

export default withRouter(LandingPage);