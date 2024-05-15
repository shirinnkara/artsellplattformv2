<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    <script src="{{ asset('js/checkMessages.js') }}" defer>
         src="//unpkg.com/alpinejs" defer>

    </script>
</head>
<body class="light:base-color-light dark: base-color-dark font-sans antialiased">
  
    <!-- Page Heading -->
    @if (isset($header))
        <header class="light:base-color-light dark: base-color-dark">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {{ $header }}
            </div>
        </header>
    @endif
  
    <!-- Page Content -->
    <main>
        {{ $slot }}
    </main>

</body>
</html>