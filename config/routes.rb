Rails.application.routes.draw do
  resource :today, only: [:show]

  resource :dashboard, only: [:show] do
    member do
      get 'today'
      get 'week'
    end
  end

  resources :projects, only: [:index, :create, :destroy] do
    resources :tasks
  end

  resources :tasks do
    resources :pomodori, only: [:new, :show, :create, :destroy]
  end
  root 'today#show'
end
