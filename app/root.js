import React, { Component } from 'react'
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import Picker     from './components/picker'
import RNUploader from 'react-native-uploader'

class Root extends Component {
  constructor(props) {
    super(props)
    this.state = {...initState}
  }

  afterPicked(ref) {
    let refName     = ref.getName()
    let imgFilePath = ref.getImage().filepath

    this.state.imageRefs = this.state.imageRefs.map(iR => {
      if (iR.name == refName) {
        return {...iR, image: {filepath: imgFilePath}}
      }
      return iR
    })
  }

  uploadImage() {
    // reset before error
    this.setState({error: null})

    // reset if is uploaded
    if (this.state.isUploaded) {
      this.setState(initState)
    }
    else {
      // get image files
      let { firstImage, secondImage, lastImage } = this.refs
      let imageFiles = [firstImage, secondImage, lastImage]
        .map(img => { return img.getImage() })
        .filter(imageFile => imageFile != null)

      if (imageFiles.length == 0){
        this.setState({error: 'No images to upload'})
      }
      else{
        // change status to uploading
        this.setState({isUploading: true})

        // build opts for uploader
        let opts = {
          url: 'https://posttestserver.com/post.php', // not use localhost here for android. It must be a ip address.
          files: imageFiles,
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          params: { coder: 'tranquangvu' }
        }

        // upload to server
        RNUploader.upload(opts, (err, res) => {
          if (err) {
            console.log(err)
            return;
          }
          if (Platform.OS === 'ios') {
            console.log(`Response status: ${res.status}`)
            console.log(`Response data: ${res.data}`)
            if (res.status == 200) {
              this.setState({isUploaded: true, isUploading: false})
            }
          }
          if (Platform.OS === 'android') {
            this.setState({isUploaded: true, isUploading: false})
          }
        })
      }
    }
  }

  _renderStatusText() {
    let { isUploaded, isUploading } = this.state

    if (isUploading) {
      return 'Uploading....'
    }
    if (isUploaded) {
      return 'Uploaded Sucessfully. Click me to reset!'
    }
    return 'Upload'
  }

  render() {
    let {imageRefs, isUploading, error} = this.state
    
    return (
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          {imageRefs.map(iR => {
            return  <Picker 
              ref={iR.name}
              key={iR.name}
              name={iR.name}
              style={styles.picker}
              text='Touch to pick image'
              image={iR.image}
              afterPicked={(this.afterPicked).bind(this)}
            />
          })}
        </View>
        <View style={styles.submitContainer}>
          <TouchableOpacity onPress={() => this.uploadImage()} style={styles.btn} disabled={isUploading}>
            <Text style={styles.btnText}>{this._renderStatusText()}</Text>
          </TouchableOpacity>
          {error && <Text style={styles.error}>Error: {error}</Text>}
        </View>
      </View>
    )
  }
}

const initState = {
  isUploaded: false,
  isUploading: false,
  error: null,
  imageRefs: [{
    name: 'firstImage',
    image: null
  }, {
    name: 'secondImage',
    image: null
  }, {
    name: 'lastImage',
    image: null
  }]
}

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  },
  pickerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    borderTopWidth: 2,
    borderColor: '#009688',
    ...Platform.select({
      ios: {
        marginTop: 20
      }
    })
  },
  submitContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#ff9800',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 30
  },
  btnText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  error: {
    color: '#ee6e73',
    textAlign: 'center',
    fontWeight: 'bold'
  }
})

export default Root
