require 'rails_helper'

RSpec.describe 'tasks/index', type: :view do
  before(:each) do
    assign(:tasks, [
      Task.create!(
        name: 'Defend Helm\'s Deep',
        done: true
      ),
      Task.create!(
        name: 'Defend Minas Tirith',
        done: false
      )
    ])
  end

  it 'renders a list of tasks' do
    render
    assert_select '.list-group-item', count: 2
  end
end
