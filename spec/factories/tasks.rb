FactoryGirl.define do
  factory :task do
    name 'Task'
    done false
    project
  end
end
