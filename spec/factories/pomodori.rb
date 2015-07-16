FactoryGirl.define do
  factory :pomodoro do
    started_at { 25.minutes.ago }
    completed_at { Time.current }
    length 25
  end
end
