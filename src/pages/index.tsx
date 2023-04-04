import Head from "next/head";
import Link from "next/link";

import {
	ArrowUturnLeftIcon,
	MagnifyingGlassIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
	ClockIcon,
	SparklesIcon,
	ClipboardDocumentIcon,
	BookOpenIcon,
} from "@heroicons/react/24/solid";

import useStateCallback from "../hooks/useStateCallback";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

function especialCharMask(especialChar: string) {
	especialChar = especialChar.replace(/[áàãâä]/giu, "a");
	especialChar = especialChar.replace(/[éèêë]/giu, "e");
	especialChar = especialChar.replace(/[íìîï]/giu, "i");
	especialChar = especialChar.replace(/[ôõóòö]/giu, "o");
	especialChar = especialChar.replace(/[úùûü]/giu, "u");
	especialChar = especialChar.replace(/[ç]/giu, "c");
	especialChar = especialChar.replace(/[^a-z0-9]/gi, "-");
	especialChar = especialChar.replace(/_+/g, "-"); //
	return especialChar;
}

export default function Home() {
	const [search, setSearch] = useStateCallback<string>("");
	const [receita, setReceita] = useStateCallback<any | null>(null);
	const [lastReceitas, setLastReceitas] = useStateCallback<any[] | null>(
		null
	);

	useEffect(() => {
		setLastReceitas(JSON.parse(localStorage?.receitas || "false") || null);
	}, [setLastReceitas]);

	const handleSearch = async (event: any) => {
		event.preventDefault();

		getReceitas(especialCharMask(search.trim()))
			.then((res) => {
				setReceita(res, (current) => {
					setLastReceitas(
						(prev) =>
							prev
								? [
										{
											nome: current.nome,
											rendimento: current.rendimento,
											tempo: current.tempo,
										},
										...prev.filter(
											(item) => item.nome !== current.nome
										),
								  ].slice(0, 6)
								: [
										{
											nome: current.nome,
											rendimento: current.rendimento,
											tempo: current.tempo,
										},
								  ],
						(value) =>
							(localStorage.receitas = JSON.stringify(value))
					);
				});
			})
			.catch((err) => setReceita(err));
	};

	const getReceitas = useCallback(async (search: string) => {
		let res = await fetch(
			"https://api-receitas-web-scraping.vercel.app/receita",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ search }),
			}
		);
		let data = await res.json();
		return data;
	}, []);

	const handleClick = (value: string) => {
		getReceitas(especialCharMask(value.trim()))
			.then((res) => {
				setReceita(res, (current) => {
					setLastReceitas(
						(prev) =>
							prev
								? [
										{
											nome: current.nome,
											rendimento: current.rendimento,
											tempo: current.tempo,
										},
										...prev.filter(
											(item) => item.nome !== current.nome
										),
								  ].slice(0, 6)
								: [
										{
											nome: current.nome,
											rendimento: current.rendimento,
											tempo: current.tempo,
										},
								  ],
						(value) =>
							(localStorage.receitas = JSON.stringify(value))
					);
				});
			})
			.catch((err) => setReceita(err));
	};

	return (
		<>
			<Head>
				<title>Raspagem de Receitas</title>
				<meta
					name='description'
					content='Usado para busca de receitas'
				/>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<header className='grid h-8 place-items-center bg-gradient-to-r from-pink-500 to-indigo-500'>
				<p className='select-none text-sm font-semibold text-gray-50'>
					UNIP &raquo; Sistemas Distribuídos
				</p>
			</header>
			<main className='space-y-6 bg-gradient-to-b from-slate-50 py-6 dark:bg-slate-800'>
				<div className='mx-6 flex max-sm:flex-col max-sm:space-y-6 sm:items-start sm:justify-between'>
					<div>
						<h1 className='text-xl font-medium text-gray-700 dark:text-gray-100 sm:text-2xl'>
							Receitas com web scraping 🍪
						</h1>
						<p className='text-sm font-normal text-gray-500 dark:text-gray-400 sm:text-base'>
							Pesquise por receitas rapidamente.
						</p>
					</div>

					<div className="inline-flex space-x-1">
						<Link
							href='https://github.com/joao-coimbra/web-scraping-receitas'
							target='_blank'
							className='inline-flex items-center space-x-2 rounded-lg border border-slate-100 bg-indigo-500 px-3 py-2 text-sm font-thin text-gray-100 duration-75 hover:bg-indigo-400'
						>
							<div>
								<svg
									className='h-6 w-6 fill-current'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
								>
									<g data-name='Layer 2'>
										<rect
											width='24'
											height='24'
											transform='rotate(180 12 12)'
											opacity='0'
										/>
										<path
											d='M12 1A10.89 10.89 0 0 0 1 11.77 10.79 10.79 0 0 0 8.52 22c.55.1.75-.23.75-.52v-1.83c-3.06.65-3.71-1.44-3.71-1.44a2.86 2.86 0 0 0-1.22-1.58c-1-.66.08-.65.08-.65a2.31 2.31 0 0 1 1.68 1.11 2.37 2.37 0 0 0 3.2.89 2.33 2.33 0 0 1 .7-1.44c-2.44-.27-5-1.19-5-5.32a4.15 4.15 0 0 1 1.11-2.91 3.78 3.78 0 0 1 .11-2.84s.93-.29 3 1.1a10.68 10.68 0 0 1 5.5 0c2.1-1.39 3-1.1 3-1.1a3.78 3.78 0 0 1 .11 2.84A4.15 4.15 0 0 1 19 11.2c0 4.14-2.58 5.05-5 5.32a2.5 2.5 0 0 1 .75 2v2.95c0 .35.2.63.75.52A10.8 10.8 0 0 0 23 11.77 10.89 10.89 0 0 0 12 1'
											data-name='github'
										/>
									</g>
								</svg>
							</div>
							<span className='font-medium'>GitHub</span>
						</Link>

						<Link
							href='https://github.com/joao-coimbra/web-scraping-receitas/tree/api'
							target='_blank'
							className='grid place-items-center space-x-2 rounded-lg border border-slate-100 bg-teal-500 px-3 py-2 text-sm font-thin text-gray-100 duration-75 hover:bg-teal-400'
						>
							<span className='font-semibold font-mono'>API</span>
						</Link>
					</div>
				</div>

				<div className='mx-6 space-y-2 rounded-lg border-l-4 border-sky-400 bg-sky-50 p-6 text-sm font-normal text-gray-500 shadow sm:text-base'>
					<p>
						Os dados são raspados do site{" "}
						<Link
							href='https://www.receiteria.com.br'
							target='_blank'
							className='text-blue-500'
						>
							receitaria
						</Link>
						.
					</p>
					<p>
						Com o intuito apenas de efetuar buscas com base no nome
						de receitas.
					</p>
				</div>

				<form
					onSubmit={handleSearch}
					className='cursor-text bg-slate-100'
				>
					<label htmlFor='search' className='flex items-center px-6'>
						<input
							id='search'
							type='text'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Procure por uma receita'
							autoComplete='off'
							className='peer grow bg-transparent py-6 text-gray-400 outline-none duration-100 focus:text-gray-800'
							required
						/>
						<div className='order-first m-3.5 rounded-full p-2.5 text-gray-400 hover:text-gray-800 peer-focus:text-gray-800 max-sm:mx-2'>
							<MagnifyingGlassIcon className='h-6 w-6 text-current duration-100' />
						</div>
						<button className='order-last m-3.5 rounded-full p-2.5 text-gray-400 duration-300 hover:-rotate-12 hover:text-gray-800 peer-focus:text-gray-800 max-sm:mx-2'>
							<PaperAirplaneIcon className='h-6 w-6 text-current duration-100' />
						</button>
					</label>
				</form>

				{receita ? (
					receita.status ? (
						<div className='relative space-y-6 border-indigo-500 bg-indigo-50 p-6 text-indigo-500 shadow sm:mx-6 sm:border-l-4'>
							<button
								onClick={() => {
									setReceita(null);
									setSearch("");
								}}
								className='inline-flex items-center space-x-1.5 opacity-40 duration-100 hover:underline hover:opacity-100'
							>
								<div>
									<ArrowUturnLeftIcon className='h-4 w-4 stroke-2' />
								</div>
								<span>voltar para lista de escolhas</span>
							</button>
							<div>
								<h2 className='text-xl font-semibold text-current'>
									{receita.nome}
								</h2>
								{receita.img ? (
									<div className='relative mt-2 grid h-32 place-items-center overflow-hidden'>
										<img
											src={receita.img}
											alt='imagem da receita'
											className='absolute w-full'
										/>
									</div>
								) : null}
								<div className='mt-2 inline-flex space-x-4 text-gray-600'>
									<div className='flex items-center space-x-1'>
										<div>
											<ClockIcon className='h-5 w-5 fill-white stroke-black' />
										</div>
										<span>{receita.tempo}</span>
									</div>
									<div className='flex items-center space-x-1'>
										<div>
											<SparklesIcon className='h-5 w-5 fill-yellow-400 stroke-black' />
										</div>
										<span>{receita.rendimento}</span>
									</div>
								</div>
							</div>
							<div>
								<h3 className='text-lg font-semibold text-current'>
									Ingredientes
								</h3>
								<ul className='mt-4 list-inside list-disc space-y-2 text-gray-600'>
									{receita.ingredientes.map(
										(ingrediente: any, index: number) => (
											<li key={index}>{ingrediente}</li>
										)
									)}
								</ul>
							</div>
							<div>
								<h3 className='text-lg font-semibold text-current'>
									Modo de Preparo
								</h3>
								<ol className='mt-4 list-inside list-decimal space-y-2 text-gray-600'>
									{receita.modo_preparo.map(
										(step: any, index: number) => (
											<li key={index}>{step}</li>
										)
									)}
								</ol>
							</div>
							<div>
								<h3 className='text-lg font-semibold text-current'>
									Dicas
								</h3>
								<ul className='mt-4 space-y-2 text-gray-600'>
									{receita.dicas.map(
										(tip: any, index: number) => (
											<li key={index}>{tip}</li>
										)
									)}
								</ul>
							</div>
						</div>
					) : (
						<div className='relative space-y-6 border-rose-500 bg-rose-50 p-6 text-rose-500 shadow sm:mx-6 sm:border-l-4'>
							<div className='inline-flex flex-col text-lg font-normal text-current'>
								<span>{receita.message}.</span>
								<button
									onClick={() => {
										setReceita(null);
										setSearch("");
									}}
									className='mt-8 w-fit rounded-lg bg-rose-500 px-5 py-1.5 text-white duration-100 hover:bg-rose-400'
								>
									<span>Retornar</span>
								</button>
							</div>
						</div>
					)
				) : (
					<div className='space-y-6'>
						<div>
							<h2 className='mx-6 text-lg font-medium text-gray-700'>
								Veja uma das receitas favoritas
							</h2>
							<ul className='mt-4'>
								<li className='group duration-100 hover:bg-indigo-100'>
									<button
										className='flex w-full space-x-4 px-6 py-2.5'
										onClick={() =>
											handleClick("Macarrão alho e óleo")
										}
									>
										<div className='rounded-lg bg-indigo-200 p-2.5 text-indigo-500 shadow duration-100 group-hover:bg-indigo-500 group-hover:text-white'>
											<BookOpenIcon className='h-6 w-6 text-current' />
										</div>
										<div className='text-start'>
											<span className='font-semibold text-gray-700'>
												Macarrão alho e óleo
											</span>
											<p className='text-sm text-gray-400'>
												• 30 min • 2 porções
											</p>
										</div>
									</button>
								</li>
								<li className='group duration-100 hover:bg-indigo-100'>
									<button
										className='flex w-full space-x-4 px-6 py-2.5'
										onClick={() =>
											handleClick("Cream cheese")
										}
									>
										<div className='rounded-lg bg-indigo-200 p-2.5 text-indigo-500 shadow duration-100 group-hover:bg-indigo-500 group-hover:text-white'>
											<BookOpenIcon className='h-6 w-6 text-current' />
										</div>
										<div className='text-start'>
											<span className='font-semibold text-gray-700'>
												Cream cheese
											</span>
											<p className='text-sm text-gray-400'>
												• 30 min • 4 porções
											</p>
										</div>
									</button>
								</li>
							</ul>
						</div>

						{lastReceitas?.filter((item) => item.nome) ? (
							<div>
								<h2 className='mx-6 text-lg font-medium text-gray-700'>
									Últimas receitas pesquisadas por você:
								</h2>
								<ul className='mt-4'>
									{lastReceitas
										?.filter((item) => item.nome)
										.map((receita) => (
											<li
												key={receita.nome}
												className='group duration-100 hover:bg-indigo-100'
											>
												<button
													className='flex w-full space-x-4 px-6 py-2.5'
													onClick={() =>
														handleClick(
															receita.nome
														)
													}
												>
													<div className='rounded-lg bg-indigo-200 p-2.5 text-indigo-500 shadow duration-100 group-hover:bg-indigo-500 group-hover:text-white'>
														<ClockIcon className='h-6 w-6 text-current' />
													</div>
													<div className='text-start'>
														<span className='font-semibold text-gray-700'>
															{receita.nome}
														</span>
														<p className='text-sm text-gray-400'>
															• {receita.tempo} •{" "}
															{receita.rendimento}
														</p>
													</div>
												</button>
											</li>
										))}
								</ul>
							</div>
						) : null}
					</div>
				)}
			</main>
		</>
	);
}
