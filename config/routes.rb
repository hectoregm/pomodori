Rails.application.routes.draw do
  resources :pomodori
  resources :pomodoros
  root 'welcome#index'
end
