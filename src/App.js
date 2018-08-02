import React, { Component } from 'react';
import './App.css';

class Image extends Component {
  render() {
    const width = this.props.width;
    const height = this.props.height;
    const id = this.props.id;
    const color = this.props.color;

    const style = {
      float: 'left',
      width: width + 'px',
      height: height + 'px',
      backgroundColor: color
    };

    return (
      <div className='Image' style={style}>
        <p>width: {width}</p>
        <p>height: {height}</p>
        <p>id: {id}</p>
      </div>
    )
  }
}

class ImageRow extends Component {
  render() {
    const images = this.props.images;

    const style = {
      clear: 'both'
    };

    var colorState = this.props.colorStateStart;

    const row = images.map((image) => {
      var color = colorState ? 'lightblue' : 'lightgrey';
      colorState = !colorState;

      return <Image width={image.adjusted_width} height={image.adjusted_height} id={image.id} key={image.id} color={color}/>
    });

    return (
      <div className='ImageRow' style={style}>
        {row}
      </div>
    )
  }
}

class Grid extends Component {
  add_ratios(images) {
    images.forEach((image) => {
      image.height_r = 1;
      image.width_r = image.width/image.height;
    });
  }

  add_adjusted_dimensions(images, target_height) {
    images.forEach((image) => {
      image.adjusted_height = target_height
      image.adjusted_width = target_height * image.width_r/image.height_r
    });
  }

  add_adjusted_dimensions_w(images, target_width) {
    const width_r_total =
      images
        .map((image) => image.width_r)
        .reduce((sum, value) => sum + value, 0);

    images.forEach((image) => {
      const adjusted_width = image.width_r/width_r_total * target_width;
      const adjusted_height = image.height_r / image.width_r * adjusted_width;

      image.adjusted_width = adjusted_width
      image.adjusted_height = adjusted_height
    });
  }

  build_rows(images, target_width) {
    var rows = [];
    var current_row = [];
    var i;

    var current_row_width = 0;
    var under_limit_width = 0;
    var over_limit_width = 0;

    for (i = 0; i < images.length; i++) { 
      current_row_width += images[i].adjusted_width;

      if (i + 1 === images.length) {
        current_row.push(images[i]);

        if (current_row_width >= target_width) {
          this.add_adjusted_dimensions_w(current_row, target_width)
        }

        rows.push(current_row);
      } else if (current_row_width >= target_width) {
        over_limit_width = current_row_width;

        if (over_limit_width - target_width < target_width - under_limit_width) {
          current_row.push(images[i]);
        } else {
          i--;
        }

        this.add_adjusted_dimensions_w(current_row, target_width)
        rows.push(current_row);

        current_row = [];
        current_row_width = 0;
        under_limit_width = 0;
        over_limit_width = 0;
      } else {
        under_limit_width = current_row_width;
        current_row.push(images[i]);
      }
    }

    return rows;
  }

  render() {
    const width = this.props.width;
    const target_height = width / 5;

    this.add_ratios(IMAGES);
    this.add_adjusted_dimensions(IMAGES, target_height);
    const rows = this.build_rows(IMAGES, width)

    const image_rows = rows.map((row, i) => {
      return <ImageRow images={row} colorStateStart={i % 2}/>;
    });

    return (
      <div className='Grid'>
        {image_rows}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Grid width='1024'/>
      </div>
    );
  }
}

const IMAGES = []

function random_between(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function generate_images(collector, width_min, width_max, height_min, height_max, number) {
  [...Array(number).keys()].forEach((i) => {
    const width = random_between(width_min, width_max);
    const height = random_between(height_min, height_max);

    collector.push({width: width, height: height, id: i});
  });
}

generate_images(IMAGES, 100, 1000, 100, 1000, 200);

export default App;
