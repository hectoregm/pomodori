Rails.application.routes.draw do
  resources :tasks do
    resources :pomodori, only: [:new, :create, :destroy]
  end
  root 'tasks#index'
end
