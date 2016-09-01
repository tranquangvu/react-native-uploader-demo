import {
  Text,
  Image,
  View,
  Platform,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import React, { Component } from 'react'
import ImagePicker          from 'react-native-image-picker'

class Picker extends Component {
  constructor(props) {
    super(props)
    this.state = {image: null, text: null}
  }

  componentWillMount() {
    const { image, text } = this.props
    this.setState({image, text})
  }

  componentWillReceiveProps(props) {
    const { name, image, text } = props
    this.setState({name, image, text})
  }

  pickPhoto() {
    let self = this
    let opts = {
      title: 'Select a image',
      storageOptions: { skipBackup: true }
    }

    ImagePicker.showImagePicker(opts, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      }
      else {
        let source = {
          name: 'image[]',
          filename: `image_${(new Date()).getTime()}`,
          filepath: response.uri.replace('file://', ''),
          isStatic: true
        }
        if (Platform.OS === 'android') {
          source.filepath = response.uri
        }
        self.pickedImage(source)
      }
    });
  }

  pickedImage(image) {
    this.setState({image: image})
    this.props.afterPicked(this)
  }

  getName() {
    return this.props.name
  }

  getImage() {
    return this.state.image
  }

  _renderElement() {
    let { image, text } = this.state
    return image ? <Image style={styles.image} source={{ uri: image.filepath }}/> :
      <Text style={styles.innerText}>{text}</Text>
  }

  render() {
    return (
      <TouchableOpacity style={[styles.item, this.props.style]} onPress={() => this.pickPhoto()}>
        {this._renderElement()}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderBottomWidth: 2,
    borderColor: '#009688'
  },
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    resizeMode: 'cover'
  },
  innerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default Picker
