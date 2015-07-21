require 'rails_helper'

RSpec.describe "tasks/new", type: :view do
  before(:each) do
    assign(:task, Task.new(
      :name => "MyString",
      :done => false
    ))
  end

  it "renders new task form" do
    render

    assert_select "form[action=?][method=?]", tasks_path, "post" do

      assert_select "input#task_name[name=?]", "task[name]"

      assert_select "input#task_done[name=?]", "task[done]"
    end
  end
end
