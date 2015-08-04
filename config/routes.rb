Rails.application.routes.draw do
  get 'dashboard/index'
  get 'dashboard/today'

  resources :tasks do
    resources :pomodori, only: [:new, :show, :create, :destroy]
  end
  root 'tasks#index'
end
