import React from "react"

const ImportFromFilerBodyComponent = ({cb}) => {
    let fileReader;
  
    const handleFileRead = () => {
      const content = fileReader.result;
      cb(content);
    }
  
    const handleFileChosen = (file) => {
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(file);
    }
  
    return <div>
      <input type='file' id='input-file' accept=".json" onChange={e => handleFileChosen(e.target.files[0])} />
    </div>
}

export class AccountFetcher extends React.Component {
    
  constructor(props) {
      super(props);

      this.state = {
          inputType:"keystore",
          inputData:{uploadedKeystore:"",
          privateKey:""}
      }
  }

  render() {
      return <div>
          < ImportFromFilerBodyComponent cb={ (e) => this.setState({inputData:{...this.state.inputData, uploadedKeystore:e}})} />
          < input type="text" value={this.state.inputData.privateKey} onChange={(e) => this.setState({inputData:
            {...this.state.inputData, privateKey:e.target.value}})} />
      </div>
  }
}