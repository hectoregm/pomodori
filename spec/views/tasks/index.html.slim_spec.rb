require 'rails_helper'

RSpec.describe 'tasks/index', type: :view do
  before(:each) do
    project = Project.create(name: 'New Project')
    assign(:project, project)

    assign(:task, Task.new)

    assign(:tasks, [
      Task.create!(
        name: 'Defend Helm\'s Deep',
        done: true,
        project: project
      ),
      Task.create!(
        name: 'Defend Minas Tirith',
        done: false,
        project: project
      )
    ])
  end

  it 'renders a list of tasks' do
    render
    assert_select '.list-group-item', count: 2
  end

  it 'renders a form to create a task' do
    render
    assert_select '#new_task'
  end
end
