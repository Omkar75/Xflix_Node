import React from 'react';
import { Link } from "react-router-dom";
import { Image } from 'semantic-ui-react';
import './VideoPreview.scss';
import moment from "moment";


export default function VideoPreview(props) {
    Date.getFormattedDateDiff = function(date1, date2) {
        var b = moment(date1),
            a = moment(date2),
            intervals = ['years','months','weeks','days','hours','minutes','seconds'],
            out = [];
      
        for(var i=0; i<intervals.length; i++){
            var diff = a.diff(b, intervals[i]);
            b.add(diff, intervals[i]);
            if(diff !== 0){
              out.push(diff + ' ' + intervals[i] + ' ago');
              break;
            }
        }
        if(out === []){
          out.push('just now');
        }
        return out;
      };
      
      var today   = new Date(),

          releaseDate = new Date(props.data.releaseDate);
      props.data.date =  Date.getFormattedDateDiff(releaseDate, today);
      const fun = {
        pathname:"/"+props.data._id,
        state: {
          date:props.data.date,
          data:props.data
        } 
      };

    return (
        <Link className="video-tile-link" to={fun}>
            <div className='video-tile'>
                <div className='image-container'>
                    <Image src={props.data.previewImage} />
                </div>
                <div className='video-info'>
                    <div className='semi-bold show-max-two-lines'>{props.data.title}</div>
                    <div className='video-tile-metadata-container'>
                    <div><span>{props.data.date}</span></div>
                    </div>
                </div>
            </div>
        </Link>
    );

}