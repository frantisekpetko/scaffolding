export class TxtLine {
  private string;
  private value;
  constructor(string) {
    this.string = string;
    this.value = string;
  }

  object() {
    return this.real_array(this.value.split('\n'));
  }

  remove(string_to_be_removed) {
    var _object = this.object();
    _object.forEach((value, index) => {
      if (value.trim() === string_to_be_removed) {
        delete _object[index];
      }
    });
    this.value = this.real_array(_object).join('\n');
    return this;
  }

  removeAll(string_to_be_removed) {
    var _object = this.object();
    _object.forEach((value, index) => {
      if (value.trim().indexOf(string_to_be_removed) != -1) {
        delete _object[index];
      }
    });
    this.value = this.real_array(_object).join('\n');
    return this;
  }

  fetch(line_number) {
    var _object = this.object();
    for (let i = 0; i < _object.length; i++) {
      if (i + 1 === line_number) {
        return _object[i];
      }
    }
    return null;
  }

  edit(content, line_number) {
    var _object = this.object();
    _object[line_number - 1] = content;
    this.value = this.real_array(_object).join('\n');
    return this;
  }

  real_array(array) {
    var output = [];
    array.forEach((element) => {
      if (element.trim().length > 0) {
        output.push(element);
      }
    });
    return output;
  }
}
